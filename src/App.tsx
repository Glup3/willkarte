import { useEffect, useState } from "react"
import viteLogo from "/vite.svg"
import reactLogo from "./assets/react.svg"
import "./App.css"
import { MapProvider } from "@vis.gl/react-maplibre"
import { Advert, fetchData, toAdvert } from "./willhaben"

function App() {
	const [adverts, setAdverts] = useState<Advert[] | null>(null)
	const [count, setCount] = useState(0)

	useEffect(() => {
		void (async () => {
			const data = await fetchData(exampleUrl)

			if (!data) {
				return
			}

			console.log(data.props.pageProps.searchResult.advertSummaryList.advertSummary[0])

			setAdverts(data.props.pageProps.searchResult.advertSummaryList.advertSummary.map(toAdvert))
		})()
	}, [])

	return (
		<MapProvider>
			<div>
				<a href="https://vite.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">Click on the Vite and React logos to learn more</p>

			<div>
				<ul>
					{adverts?.map((advert) => {
						return (
							<li key={`advert-${advert.adId}`}>
								<a href={`https://www.willhaben.at/iad/${advert.url}`} target="_blank">
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
