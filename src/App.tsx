import { MapProvider } from "@vis.gl/react-maplibre"
import { useEffect, useState } from "react"
import { WillhabenMap } from "./WillhabenMap"
import { Advert, fetchData, toAdvert } from "./willhaben"

function App() {
	const [adverts, setAdverts] = useState<Advert[] | undefined>(undefined)

	useEffect(() => {
		void (async () => {
			const data = await fetchData(exampleUrl)

			if (!data) {
				return
			}

			console.log("first", data.props.pageProps.searchResult.advertSummaryList.advertSummary[0]?.attributes.attribute)

			setAdverts(data.props.pageProps.searchResult.advertSummaryList.advertSummary.map(toAdvert))
		})()
	}, [])

	return (
		<MapProvider>
			<WillhabenMap adverts={adverts ?? []} />

			<div>
				<ul>
					{adverts?.map((advert) => {
						return (
							<li key={`advert-${advert.adId}`}>
								<a href={advert.url} target="_blank">
									{advert.heading ?? "Kein Titel"}
								</a>
							</li>
						)
					})}
				</ul>
			</div>
		</MapProvider>
	)
}

const exampleUrl =
	"https://www.willhaben.at/iad/immobilien/mietwohnungen/mietwohnung-angebote?sfId=abecdb8f-f6fc-49f7-9065-f2505624b62f&isNavigation=true&areaId=900&NO_OF_ROOMS_BUCKET=3X3"

export default App
