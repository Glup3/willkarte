import { Layer, type MapLayerMouseEvent, Map as Maplibre, Popup, Source } from "@vis.gl/react-maplibre"
import type GeoJSON from "geojson"
import { useState } from "react"
import { Advert } from "./willhaben"

const viennaCoords = [48.1994, 16.3465]

export const WillhabenMap = ({ adverts }: { adverts: Advert[] }) => {
	const [hoverInfo, setHoverInfo] = useState<{ advert: Advert; latitude: number; longitude: number } | undefined>()

	const advertData: GeoJSON.FeatureCollection<GeoJSON.Point, Advert> = {
		type: "FeatureCollection",
		features: adverts
			.map<GeoJSON.Feature<GeoJSON.Point, Advert> | null>((advert) => {
				if (!advert.latitude || !advert.longitude) {
					return null
				}

				return {
					type: "Feature",
					geometry: {
						type: "Point",
						coordinates: [advert.longitude, advert.latitude],
					},
					properties: {
						...advert,
					},
				}
			})
			.filter((advert) => advert !== null),
	}

	const onHover = (event: MapLayerMouseEvent) => {
		const feature = event.features?.[0]

		if (!feature) {
			event.target.getCanvas().style.cursor = ""
			setHoverInfo(undefined)
			return
		}

		event.target.getCanvas().style.cursor = "pointer"
		setHoverInfo({
			advert: feature.properties as Advert,
			longitude: (feature.geometry as GeoJSON.Point)?.coordinates[0],
			latitude: (feature.geometry as GeoJSON.Point)?.coordinates[1],
		})
	}

	const onClick = (event: MapLayerMouseEvent) => {
		const feature = event.features?.[0]

		if (!feature) {
			return
		}

		if (window.innerWidth < 768) {
			return
		}

		const advert = feature.properties as Advert
		window.open(advert.url, "_blank")
	}

	return (
		<Maplibre
			id="advertMap"
			initialViewState={{
				latitude: viennaCoords[0],
				longitude: viennaCoords[1],
				zoom: 11,
			}}
			style={{ width: "100%", height: 500 }}
			mapStyle="https://tiles.openfreemap.org/styles/liberty"
			interactiveLayerIds={["adverts"]}
			onMouseMove={onHover}
			onMouseDown={onClick}
		>
			<Source type="geojson" data={advertData}>
				<Layer
					{...{
						id: "adverts",
						type: "circle",
						paint: {
							"circle-radius": 7,
							"circle-color": "#007cbf",
							"circle-stroke-width": 3,
							"circle-stroke-color": "#fff",
						},
					}}
				/>
			</Source>

			{hoverInfo && <EstatePopup advert={hoverInfo.advert} />}
		</Maplibre>
	)
}

const EstatePopup = ({ advert }: { advert: Advert }) => {
	const price = typeof advert.price === "number" ? advert.price.toFixed(0) : advert.price

	return (
		<Popup
			latitude={advert.latitude}
			longitude={advert.longitude}
			offset={15}
			closeOnClick={false}
			closeButton={false}
			className="w-90"
			maxWidth="none"
		>
			<div className="flex gap-4 w-full font-sans">
				<img src={advert.thumbnailUrl} alt="advert thumbnail" className="min-w-20 h-28 w-20 rounded-md" />

				<div className="flex flex-col justify-between w-full">
					<div>
						<a href={advert.url} target="_blank">
							<h3 className="font-medium text-sm line-clamp-2">{advert.heading || "---"}</h3>
						</a>

						<div className="flex mt-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 384 512"
								className="w-2.5 mr-1 text-primary fill-current"
							>
								<path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
							</svg>
							<span>{advert.location}</span>
						</div>
					</div>

					<div className="flex justify-between items-baseline">
						<div>
							<span>
								<span className="text-lg font-bold">{advert.estateSize ?? "---"} </span>
								<span>
									m<sup>2</sup>
								</span>
							</span>
							<span className="ml-4">
								<span className="text-lg font-bold">{advert.numberOfRooms ?? "-"} </span>
							</span>
							Zimmer
						</div>

						<span className="font-medium text-xl text-primary">€ {price ?? "---"}</span>
					</div>
				</div>
			</div>
		</Popup>
	)
}
