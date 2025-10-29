import { User } from "lucide-react"

interface AuthorCardProps {
	author: {
		id: number
		name: string
		bio: string
		birthYear: number
		country: string
	}
	bookCount: number
}

const AuthorCard = ({ author, bookCount }: AuthorCardProps) => {
	return (
		<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
			<div className="flex items-center mb-4">
				<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
					<User className="w-8 h-8 text-blue-600" />
				</div>
				<div>
					<h3 className="text-xl font-bold text-gray-800">{author.name}</h3>
					<p className="text-sm text-gray-500">
						{author.country} • Born {author.birthYear}
					</p>
				</div>
			</div>
			<p className="text-sm text-gray-600 mb-3">{author.bio}</p>
			<div className="text-sm text-blue-600 font-semibold">
				{bookCount} {bookCount === 1 ? "book" : "books"} in collection
			</div>
		</div>
	)
}

export default AuthorCard
