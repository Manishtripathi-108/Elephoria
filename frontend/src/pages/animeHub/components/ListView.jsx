import React from 'react'

import NoContentCard from '../../../components/common/NoContentCard'
import MediaRow from './MediaRow'

const ListView = ({ data = [], isFavourite = false }) => {
    // Render Table Header for media list
    const renderTableHeader = () => (
        <thead className="bg-primary text-secondary border-light-secondary dark:border-dark-secondary border-x border-b">
            <tr className="hidden sm:table-row">
                <th className="sr-only"></th>
                <th className="font-aladin w-2/3 p-2 text-left font-normal tracking-widest">Title</th>
                <th className="font-aladin w-1/6 p-2 text-center font-normal tracking-widest">Progress</th>
                <th className="font-aladin w-1/6 p-2 text-center font-normal tracking-widest">Type</th>
            </tr>
        </thead>
    )

    // Render a regular media table (for Anime/Manga)
    const MediaTable = ({ list }) => (
        <div key={list.name} className="shadow-neumorphic-sm mb-5 w-full overflow-hidden rounded-xl">
            <div className="bg-secondary border-light-secondary dark:border-dark-secondary rounded-t-xl border">
                <h2 className="text-primary font-aladin p-3 text-lg tracking-widest">{list.name}</h2>
            </div>
            <table className="w-full table-auto">
                {renderTableHeader()}
                <tbody className="bg-primary">
                    {list.entries.length > 0 ? (
                        list.entries.map((mediaItem) => <MediaRow key={mediaItem.media?.id} mediaItem={mediaItem} />)
                    ) : (
                        <tr>
                            <td className="p-4 text-center tracking-wider text-red-500" colSpan="4">
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )

    // Render a Favourite media table (for Anime/Manga)
    const FavouriteTable = ({ type, media }) => (
        <div className="shadow-neumorphic-sm mb-5 w-full overflow-hidden rounded-xl">
            <div className="bg-secondary border-light-secondary dark:border-dark-secondary rounded-t-xl border">
                <h2 className="text-primary font-aladin p-3 text-lg tracking-widest">Favourite {type}</h2>
            </div>
            <table className="w-full table-auto">
                {renderTableHeader()}
                <tbody className="bg-primary">
                    {media.length > 0 ? (
                        media.map((mediaItem) => <MediaRow key={mediaItem.id} mediaItem={mediaItem} isFavourite={true} />)
                    ) : (
                        <tr>
                            <td className="p-4 text-center tracking-wider text-red-500" colSpan="4">
                                No {type.toLowerCase()} favourites available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )

    // Handle favourite list rendering
    if (isFavourite) {
        return data?.anime?.length > 0 || data?.manga?.length > 0 ? (
            <>
                {data?.anime?.length > 0 && <FavouriteTable type="Anime" media={data.anime} />}
                {data?.manga?.length > 0 && <FavouriteTable type="Manga" media={data.manga} />}
            </>
        ) : (
            <NoContentCard name="favourites" message={`Add some favourite anime or manga to your list to see them here.`} />
        )
    }

    // Render regular media list (Anime/Manga)
    return data.length > 0 ? (
        data.map((list) => <MediaTable key={list.name} list={list} />)
    ) : (
        <NoContentCard name="media" message={`Add some media to your list to see them here.`} />
    )
}

export default React.memo(ListView)
