interface NavigationTabsProps {
	activeTab: string
	setActiveTab: (tab: string) => void
	booksCount: number
	authorsCount: number
}

const NavigationTabs = ({
	activeTab,
	setActiveTab,
	booksCount,
	authorsCount,
}: NavigationTabsProps) => {
	const tabs = [
		{ id: "books", label: "Books", count: booksCount },
		{ id: "authors", label: "Authors", count: authorsCount },
		{ id: "add-author", label: "Add new author", count: null },
		{ id: "add-book", label: "Add new book", count: null },
	]

	return (
		<div className="bg-white shadow">
			<div className="container mx-auto px-4">
				<div className="flex gap-8">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`py-4 px-2 border-b-2 font-semibold transition-colors ${
								activeTab === tab.id
									? "border-indigo-600 text-indigo-600"
									: "border-transparent text-gray-500 hover:text-gray-700"
							}`}
						>
							{tab.label} {tab.count !== null && `(${tab.count})`}
						</button>
					))}
				</div>
			</div>
		</div>
	)
}

export default NavigationTabs
