import { MapProvider } from "@vis.gl/react-maplibre"
import { useState } from "react"
import { WillhabenMap } from "./WillhabenMap"
import { Advert } from "./willhaben"
import { Searchbar } from "./Searchbar"

function App() {
	const [adverts, setAdverts] = useState<Advert[] | undefined>(undefined)

	return (
		<MapProvider>
			<main className="container mx-auto h-full flex flex-col py-8">
				<div className="text-center mb-16">
					<h1 className="font-bold text-3xl md:text-6xl leading-relaxed mb-4">willhaben Immobilien Karte</h1>

					<p>Ein geniales Feature, das willhaben natürlich gerne übernehmen darf</p>
					<p>– aber was letzte Preis?</p>
				</div>

				<Searchbar setAdverts={setAdverts} />

				<WillhabenMap adverts={adverts ?? []} />
			</main>
		</MapProvider>
	)
}

export default App
