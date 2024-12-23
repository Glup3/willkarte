import { useMutation } from "@tanstack/react-query"
import { MapProvider } from "@vis.gl/react-maplibre"
import { useState } from "react"
import { WillhabenMap } from "./WillhabenMap"
import { Advert, fetchData, toAdvert } from "./willhaben"

function App() {
	const [text, setText] = useState("")
	const [adverts, setAdverts] = useState<Advert[] | undefined>(undefined)

	const { mutate, isPending, isError } = useMutation({
		mutationFn: (url: string) => fetchData(url),
		onSuccess: (resp) => {
			setAdverts(resp.props.pageProps.searchResult.advertSummaryList.advertSummary.map(toAdvert))
		},
	})

	return (
		<MapProvider>
			<main className="container mx-auto h-full flex flex-col py-8">
				<div className="text-center mb-16">
					<h1 className="font-bold text-3xl md:text-6xl leading-relaxed mb-4">willhaben Immobilien Karte</h1>

					<p>Ein geniales Feature, das willhaben natürlich gerne übernehmen darf</p>
					<p>– aber was letzte Preis?</p>
				</div>

				<form
					onSubmit={(e) => {
						e.preventDefault()

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
								onChange={(e) => setText(e.target.value)}
								type="text"
								placeholder="willhaben Immobilien URL einfügen. zb: https://www.willhaben.at/iad/immobilien/mietwohnungen/wien"
								className="input input-bordered w-full focus:outline-none focus:ring-0"
								required={true}
							/>
						</label>
						<button className="btn btn-primary" type="submit" disabled={isPending}>
							{isPending && <span className="loading loading-spinner" />}
							Suchen
						</button>
					</div>

					{isError && (
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
							<span>
								Oje, das hat nicht funktioniert. Stimmt die URL oder hat sich ein kleiner Fehler eingeschlichen?
							</span>
						</div>
					)}
				</form>

				<WillhabenMap adverts={adverts ?? []} />
			</main>
		</MapProvider>
	)
}

export default App
