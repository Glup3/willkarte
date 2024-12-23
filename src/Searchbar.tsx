import { useMutation } from "@tanstack/react-query"
import { useMap } from "@vis.gl/react-maplibre"
import { useState } from "react"
import { Advert, fetchData, toAdvert } from "./willhaben"

export const Searchbar = (props: { setAdverts: (adverts: Advert[]) => void }) => {
	const { willhabenMap } = useMap()
	const [text, setText] = useState("")
	const [isInvalidUrl, setIsInvalidUrl] = useState(false)

	const { mutate, isPending, isError } = useMutation({
		mutationFn: (url: string) => fetchData(url),
		onSuccess: (resp) => {
			const adverts = resp.props.pageProps.searchResult.advertSummaryList.advertSummary.map(toAdvert)
			props.setAdverts(adverts)

			const allCoords = adverts
				.map((a) => ({ lat: a.latitude ?? 0, lng: a.longitude ?? 0 }))
				.filter((a) => a.lat >= 47.3 && a.lat <= 49.0 && a.lng >= 9.5 && a.lng <= 17.0) // fix outliers that have sus coords
			const center = calculateCenter(allCoords)
			willhabenMap?.flyTo({ center: [center[1], center[0]], zoom: 11 })
		},
	})

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()

				if (isInvalidUrl) {
					return
				}

				mutate(text)
			}}
			autoComplete="off"
			className="mb-4"
		>
			<div className="flex items-end gap-2">
				<label className="form-control w-full">
					<div className="label">
						<span className="label-text">willhaben url</span>
					</div>

					<input
						name="willhaben-immo-url"
						value={text}
						onChange={(e) => {
							const newValue = e.target.value.trim()
							setText(newValue)
							setIsInvalidUrl(newValue !== "" && !newValue.startsWith("https://www.willhaben.at/iad/immobilien"))
						}}
						type="text"
						placeholder="willhaben Immobilien URL einfügen. zb: https://www.willhaben.at/iad/immobilien/mietwohnungen/wien"
						className={[
							"input input-bordered w-full focus:outline-none focus:ring-0",
							isInvalidUrl ? "input-error" : "",
						].join(" ")}
						required={true}
					/>
				</label>

				<button className="btn btn-primary" type="submit" disabled={isPending}>
					{isPending && <span className="loading loading-spinner" />}
					Suchen
				</button>
			</div>

			{isInvalidUrl && (
				<ErrorAlert text="Hoppla! Die URL scheint falsch zu sein. Sie sollte mit „https://www.willhaben.at/iad/immobilien“ beginnen." />
			)}

			{isError && (
				<ErrorAlert text="Oje, das hat nicht funktioniert. Stimmt die URL oder hat sich ein kleiner Fehler eingeschlichen?" />
			)}
		</form>
	)
}

const ErrorAlert = ({ text }: { text: string }) => {
	return (
		<div role="alert" className="alert alert-error mt-4">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>{text}</span>
		</div>
	)
}

const calculateCenter = (coords: { lat: number; lng: number }[]) => {
	const totalCoords = coords.length

	const [sumLat, sumLng] = coords.reduce(([latSum, lngSum], { lat, lng }) => [latSum + lat, lngSum + lng], [0, 0])

	return [sumLat / totalCoords, sumLng / totalCoords]
}
