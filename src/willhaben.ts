export async function fetchData(url: string): Promise<Root | null> {
	try {
		const resp = await fetch(url.replace(/^https:\/\/www\.willhaben\.at/, "/api"))

		if (resp.status !== 200) {
			console.log("status !== 200", resp)
			return null
		}

		const data = await resp.text()
		const parser = new DOMParser()
		const doc = parser.parseFromString(data, "text/html")

		const nextDataScript = doc.querySelector("script#__NEXT_DATA__")

		if (!nextDataScript) {
			console.error("__NEXT_DATA__ script not found!")
			return null
		}

		const nextData = JSON.parse(nextDataScript.textContent || "") as unknown as Root
		return nextData
	} catch (e) {
		console.log("fetching data error", e)
		return null
	}
}

export function toAdvert(advertSummary: AdvertSummary): Advert {
	const attributes = advertSummary.attributes.attribute
	const coordinates = advertSummary.attributes.attribute.find((a) => a.name === "COORDINATES")?.values[0].split(",")
	const price = advertSummary.attributes.attribute.find((a) => a.name === "PRICE")?.values[0]
	const priceAsNumber = Number(price)
	const firstImageUrl = attributes.find((a) => a.name === "ALL_IMAGE_URLS")?.values[0].split(";")[0]

	return {
		attributes,
		adId: advertSummary.id,
		heading: attributes.find((a) => a.name === "HEADING")?.values[0],
		url: `https://www.willhaben.at/iad/${attributes.find((a) => a.name === "SEO_URL")?.values[0]}`,
		latitude: Number(coordinates?.[0]) || undefined,
		longitude: Number(coordinates?.[1]) || undefined,
		estateSize: attributes.find((a) => a.name === "ESTATE_SIZE")?.values[0],
		thumbnailUrl: firstImageUrl ? `https://cache.willhaben.at/mmo/${firstImageUrl}` : undefined,
		price: isNaN(priceAsNumber) ? price : priceAsNumber,
	}
}

export interface Advert {
	adId: string
	heading: string | undefined
	url: string | undefined
	latitude: number | undefined // e.g. 48.248.2439666
	longitude: number | undefined // e.g. 16.4821342
	estateSize: string | undefined
	thumbnailUrl: string | undefined
	price: string | number | undefined
	attributes: Attribute[]
}

// https://transform.tools/json-to-typescript
export interface Root {
	props: Props
	page: string
	query: Query
	buildId: string
	assetPrefix: string
	runtimeConfig: RuntimeConfig
	isFallback: boolean
	isExperimentalCompile: boolean
	gip: boolean
	appGip: boolean
	scriptLoader: any[]
}

export interface Props {
	pageProps: PageProps
	showVerificationAlert: boolean
	userAgent: string
	isSSG: boolean
	toggles: Toggles
	initialOptimizelyDatafile: InitialOptimizelyDatafile
	cookies: Cookies
	is404: boolean
	verticalsInfo: VerticalsInfo
}

export interface PageProps {
	searchResult: SearchResult
	searchTerms: SearchTerms
}

export interface SearchResult {
	id: number
	description: string
	heading: string
	verticalId: number
	searchId: number
	rowsRequested: number
	rowsFound: number
	rowsReturned: number
	pageRequested: number
	searchDate: string
	lastUserAlertViewedDate: any
	newAdsSeparatorPosition: any
	advertSummaryList: AdvertSummaryList
	breadcrumbs: Breadcrumb[]
	navigatorGroups: NavigatorGroup[]
	searchExcludeList: SearchExcludeList
	pagingLinksList: PagingLinksList
	sortOrderList: SortOrderList
	searchContextLinks: SearchContextLinks
	taggingData: TaggingData
	seoMetaData: SeoMetaData
	autocompleteLinkList: AutocompleteLinkList
	searchTitle: string
	searchSubTitle: string
	advertisingParameters: AdvertisingParameters
	advertisingParametersV2: AdvertisingParametersV2
	dmpParameters: DmpParameters
	dmpUserIdentities: DmpUserIdentities
	metaData: MetaData
	statistics: any
}

export interface AdvertSummaryList {
	advertSummary: AdvertSummary[]
}

export interface AdvertSummary {
	id: string
	verticalId: number
	adTypeId: number
	productId: number
	advertStatus: AdvertStatus
	description: string
	attributes: Attributes
	advertImageList: AdvertImageList
	selfLink: string
	contextLinkList: ContextLinkList
	advertiserInfo: AdvertiserInfo
	upsellingOrganisationLogo?: string
	teaserAttributes: TeaserAttribute[]
	children?: Children[]
}

export interface AdvertStatus {
	id: string
	description: string
	statusId: number
}

export interface Attributes {
	attribute: Attribute[]
}

export interface Attribute {
	name: string
	values: string[]
}

export interface AdvertImageList {
	advertImage: AdvertImage[]
	floorPlans: any[]
}

export interface AdvertImage {
	id: number
	name: string
	selfLink: string
	description: string
	mainImageUrl: string
	thumbnailImageUrl: string
	referenceImageUrl: string
	similarImageSearchUrl: any
	reference: string
}

export interface ContextLinkList {
	contextLink: ContextLink[]
}

export interface ContextLink {
	id: string
	description: string
	uri: string
	selected: boolean
	relativePath: string
	serviceName: string
}

export interface AdvertiserInfo {
	label: string
	iconSVG: any
	iconPNG: any
	iconType: string
}

export interface TeaserAttribute {
	prefix: any
	value: string
	postfix: string
}

export interface Children {
	id: string
	verticalId: number
	adTypeId: number
	productId: number
	advertStatus: any
	description: any
	attributes: Attributes2
	advertImageList: AdvertImageList2
	selfLink: any
	contextLinkList: ContextLinkList2
	advertiserInfo: any
	upsellingOrganisationLogo: any
	teaserAttributes: TeaserAttribute2[]
	children: any
}

export interface Attributes2 {
	attribute: Attribute2[]
}

export interface Attribute2 {
	name: string
	values: string[]
}

export interface AdvertImageList2 {
	advertImage: AdvertImage2[]
	floorPlans: any[]
}

export interface AdvertImage2 {
	id: number
	name: string
	selfLink: string
	description: string
	mainImageUrl: string
	thumbnailImageUrl: string
	referenceImageUrl: string
	similarImageSearchUrl: any
	reference: string
}

export interface ContextLinkList2 {
	contextLink: ContextLink2[]
}

export interface ContextLink2 {
	id: string
	description: string
	uri: string
	selected: boolean
	relativePath: string
	serviceName: string
}

export interface TeaserAttribute2 {
	prefix: any
	value: string
	postfix: string
}

export interface Breadcrumb {
	displayName: string
	seoUrl: string
}

export interface NavigatorGroup {
	label: string
	navigatorList: NavigatorList[]
}

export interface NavigatorList {
	id: string
	label: string
	possibleValues: any[]
	groupedPossibleValues: GroupedPossibleValue[]
	selectedValues: SelectedValue[]
	navigatorType: string
	navigatorSelectionType: string
	urlConstructionInformation: UrlConstructionInformation
	resetAllInformation?: ResetAllInformation
	navigatorValuesDisplayType: string
	metaTags?: string[]
	metadata?: Metadata
	navigatorFromValues?: NavigatorFromValue[]
	navigatorToValues?: NavigatorToValue[]
	quickToggle: any
	defaultFromNavigatorValue?: DefaultFromNavigatorValue
	defaultToNavigatorValue?: DefaultToNavigatorValue
	alternativeRanges?: any[]
	alternativeLabel: any
	unit: any
}

export interface GroupedPossibleValue {
	label: any
	possibleValues: PossibleValue[]
}

export interface PossibleValue {
	label: string
	prePostTextInfo: any
	images: any[]
	urlParamRepresentationForValue: UrlParamRepresentationForValue[]
	parent: any
	parentId?: string
	parentLabel: any
	searchLink: SearchLink
	webLink: any
	hits: number
	metaTags: any[]
}

export interface UrlParamRepresentationForValue {
	urlParameterName: string
	navigatorUrlParameterType: string
	value: string
}

export interface SearchLink {
	id: string
	description: string
	uri: string
	selected: boolean
	relativePath: string
	serviceName: string
}

export interface SelectedValue {
	label: string
	prePostTextInfo: any
	images: any[]
	urlParamRepresentationForValue: UrlParamRepresentationForValue2[]
	parent: any
	parentId: any
	parentLabel: any
	resetLink?: ResetLink
}

export interface UrlParamRepresentationForValue2 {
	urlParameterName: string
	navigatorUrlParameterType: string
	value: string
}

export interface ResetLink {
	id: string
	description: string
	uri: string
	selected: boolean
	relativePath: string
	serviceName: string
}

export interface UrlConstructionInformation {
	baseUrl: BaseUrl
	urlParams: UrlParam[]
}

export interface BaseUrl {
	id: string
	description: string
	uri: string
	selected: boolean
	relativePath: string
	serviceName: string
}

export interface UrlParam {
	urlParameterName: string
	navigatorUrlParameterType: string
}

export interface ResetAllInformation {
	resetAllUrl: ResetAllUrl
}

export interface ResetAllUrl {
	id: string
	description: string
	uri: string
	selected: boolean
	relativePath: string
	serviceName: string
}

export interface Metadata {
	placeholder?: string
	autocompleteLink?: AutocompleteLink
}

export interface AutocompleteLink {
	id: string
	description: string
	uri: string
	selected: boolean
	relativePath: string
	serviceName: string
}

export interface NavigatorFromValue {
	label: string
	value: string
}

export interface NavigatorToValue {
	label: string
	value: string
}

export interface DefaultFromNavigatorValue {
	label: string
	value: string
}

export interface DefaultToNavigatorValue {
	label: string
	value: string
}

export interface SearchExcludeList {
	contextLink: any[]
}

export interface PagingLinksList {
	contextLink: ContextLink3[]
}

export interface ContextLink3 {
	id: string
	description: string
	uri: string
	selected: boolean
	relativePath: string
	serviceName: string
}

export interface SortOrderList {
	contextLink: ContextLink4[]
}

export interface ContextLink4 {
	id: string
	description: string
	uri: string
	selected: boolean
	relativePath: string
	serviceName: string
}

export interface SearchContextLinks {
	contextLink: ContextLink5[]
}

export interface ContextLink5 {
	id: string
	description: string
	uri: string
	selected: boolean
	relativePath: string
	serviceName: string
	iconPNG?: string
	iconSVG?: string
}

export interface TaggingData {
	taggingNames: TaggingNames
	tmsDataValues: TmsDataValues
	pulseData: PulseData
	neustarTaggingData: NeustarTaggingData
}

export interface TaggingNames {
	nameValuePair: NameValuePair[]
}

export interface NameValuePair {
	name: string
	value: string
}

export interface TmsDataValues {
	tmsData: TmsData
}

export interface TmsData {
	search_results_number: string
	rooms: string
	ad_type: string
	page_type: string
	region_level_label_1: string
	vertical_id: string
	category_level_id_1: string
	vertical: string
	source: string
	category_tree_id: string
	category_level_1: string
	environment: string
	region_level_id_2: string
	region_level_id_1: string
	category_level_max: string
	search_results_displaycount: string
	region_level_2: string
	event_name: string
	search_results_page: string
	no_of_rooms: string
	region_level_1: string
}

export interface PulseData {
	pulseEvents: PulseEvent[]
}

export interface PulseEvent {
	type: string
	id: number
	contentId: number
	name: string
	adType: string
	items: any[]
	classifiedAdObjects: ClassifiedAdObject[]
	numItems: number
	category: string
	filters: Filters
	search: Search
}

export interface ClassifiedAdObject {
	type: string
	id: number
	adId: number
	adUuid: string
	publisher: Publisher
}

export interface Publisher {
	id: string
	accountId: string
	type: string
}

export interface Filters {
	adType: string
	sorting: string
	numResults: string
	region: string
}

export interface Search {
	"@id": string
	"@type": string
	maxRank: number
	offset: number
	genericSearchFilters: GenericSearchFilter[]
	searchConfigId: number
}

export interface GenericSearchFilter {
	label: string
	values: string[]
}

export interface NeustarTaggingData {
	mainCategory: string
	vertical: string
	device: string
}

export interface SeoMetaData {
	canonicalUrl: string
	alternateUrl: string
	title: string
	keywords: string
	description: string
	orgId: any
}

export interface AutocompleteLinkList {
	contextLink: ContextLink6[]
}

export interface ContextLink6 {
	id: string
	description: string
	uri: string
	selected: boolean
	relativePath: string
	serviceName: string
}

export interface AdvertisingParameters {
	pagetype: string[]
	estate_level0: string[]
	search_alert: string[]
	rooms: string[]
	searchcount: string[]
	district: string[]
	payliveryEnabled: string[]
	vertical: string[]
	state: string[]
	device: string[]
}

export interface AdvertisingParametersV2 {
	pagetype: string
	estate_level0: string
	search_alert: string
	rooms: number[]
	searchcount: number
	district: string[]
	payliveryEnabled: string
	vertical: string
	state: string[]
	device: string
}

export interface DmpParameters {
	pagetype: string
	estate_level0: string
	search_alert: boolean
	rooms: number[]
	searchcount: number
	district: string[]
	payliveryEnabled: boolean
	vertical: string
	state: string[]
	device: string
}

export interface DmpUserIdentities {}

export interface MetaData {
	viewMode: string
	defaultPageSize: number
}

export interface SearchTerms {
	title: string
	searchTerms: SearchTerm[]
}

export interface SearchTerm {
	id: number
	url: string
	name: string
}

export interface Toggles {
	enableUserZoomMyProfile: boolean
	enableUserZoomAutoMotorResultList: boolean
	enableUserZoomAutoMotorAdDetail: boolean
	enableUserZoomAutoMotorStartpages: boolean
	enableUserZoomRealEstateResultList: boolean
	enableUserZoomRealEstateDetailSearch: boolean
	enableUserZoomRealEstateStartpage: boolean
	enableUserZoomRealEstateAdDetail: boolean
	enableUserZoomBapAdDetail: boolean
	enableUserZoomBapResultList: boolean
	enableUserZoomBapStartPage: boolean
	enableUserZoomStartPage: boolean
	enableUserZoomAzaNegativePage: boolean
	enableUserZoomAzaPositivePage: boolean
	enableUserZoomFashion: boolean
	enableUserZoomPriceFinder: boolean
	enableUserZoomPersonalization: boolean
	enableShippingCampaign: boolean
	disableZendeskWidget: boolean
	dsaReportingIadEnabled: boolean
	dsaReportingMessagingEnabled: boolean
	enableBudgetCalculatorInFilterRealEstateResultList: boolean
	enableSizePersonalization: boolean
	enableAutoMotorDealerProfile: boolean
	enableAutoMotorRedirectToPersonalizedDealerUrl: boolean
	enableMyTransactionsPage: boolean
	enableMaterialFilterFakeDoorTest: boolean
}

export interface InitialOptimizelyDatafile {
	accountId: string
	projectId: string
	revision: string
	attributes: Attribute3[]
	audiences: Audience[]
	version: string
	events: Event[]
	integrations: any[]
	anonymizeIP: boolean
	botFiltering: boolean
	typedAudiences: any[]
	variables: any[]
	environmentKey: string
	sdkKey: string
	featureFlags: FeatureFlag[]
	rollouts: Rollout[]
	experiments: any[]
	groups: any[]
}

export interface Attribute3 {
	id: string
	key: string
}

export interface Audience {
	id: string
	name: string
	conditions: string
}

export interface Event {
	id: string
	experimentIds: any[]
	key: string
}

export interface FeatureFlag {
	id: string
	key: string
	rolloutId: string
	experimentIds: any[]
	variables: Variable[]
}

export interface Variable {
	id: string
	key: string
	type: string
	defaultValue: string
}

export interface Rollout {
	id: string
	experiments: Experiment[]
}

export interface Experiment {
	id: string
	key: string
	status: string
	layerId: string
	variations: Variation[]
	trafficAllocation: TrafficAllocation[]
	forcedVariations: ForcedVariations
	audienceIds: any[]
	audienceConditions: any[]
}

export interface Variation {
	id: string
	key: string
	featureEnabled: boolean
	variables: Variable2[]
}

export interface Variable2 {
	id: string
	value: string
}

export interface TrafficAllocation {
	entityId: string
	endOfRange: number
}

export interface ForcedVariations {}

export interface Cookies {
	IADVISITOR: string
}

export interface VerticalsInfo {
	vertical: Vertical[]
}

export interface Vertical {
	id: number
	description: string
	nrOfAdverts: number
	selfLink: string
	searchConfigLink: string
	startPageLink?: string
	taggingData: TaggingData2
}

export interface TaggingData2 {
	taggingNames: TaggingNames2
	tmsDataValues: TmsDataValues2
	pulseData: any
	neustarTaggingData: any
}

export interface TaggingNames2 {
	nameValuePair: NameValuePair2[]
}

export interface NameValuePair2 {
	name: string
	value: string
}

export interface TmsDataValues2 {
	tmsData: TmsData2
}

export interface TmsData2 {
	vertical_id: string
	environment: string
	vertical: string
	source: string
	page_type?: string
}

export interface Query {
	sfId: string
	isNavigation: string
	areaId: string
	NO_OF_ROOMS_BUCKET: string
	seopath: string[]
}

export interface RuntimeConfig {
	context: string
	app: string
}
