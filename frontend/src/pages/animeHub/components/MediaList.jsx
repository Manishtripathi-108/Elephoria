import React from 'react'

import NoDataCard from '../../../components/common/NoDataCard'
import MediaRow from './MediaRow'

function MediaList({ data = [], isFavorite = false }) {
    // Render Table Header for media list
    const renderTableHeader = () => (
        <thead className="bg-primary text-secondary border-x border-b border-light-secondary dark:border-dark-secondary">
            <tr className="hidden sm:table-row">
                <th className="sr-only"></th>
                <th className="w-2/3 p-2 text-left font-aladin font-normal tracking-widest">Title</th>
                <th className="w-1/6 p-2 text-center font-aladin font-normal tracking-widest">Progress</th>
                <th className="w-1/6 p-2 text-center font-aladin font-normal tracking-widest">Type</th>
            </tr>
        </thead>
    )

    // Render a regular media table (for Anime/Manga)
    const MediaTable = ({ list }) => (
        <div key={list.name} className="mb-5 w-full overflow-hidden rounded-xl shadow-neu-light-sm dark:shadow-neu-dark-sm">
            <div className="bg-secondary rounded-t-xl border border-light-secondary dark:border-dark-secondary">
                <h2 className="text-primary p-3 font-aladin text-lg tracking-widest">{list.name}</h2>
            </div>
            <table className="w-full table-auto">
                {renderTableHeader()}
                <tbody className="bg-primary">
                    {list.entries.length > 0 ? (
                        list.entries.map((mediaItem) => <MediaRow key={mediaItem.media?.id} mediaItem={mediaItem} />)
                    ) : (
                        <tr>
                            <td className="p-4 text-center font-indie-flower tracking-wider text-red-500" colSpan="4">
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )

    // Render a favorite media table (for Anime/Manga)
    const FavoriteTable = ({ type, media }) => (
        <div className="mb-5 w-full overflow-hidden rounded-xl shadow-neu-light-sm dark:shadow-neu-dark-sm">
            <div className="bg-secondary rounded-t-xl border border-light-secondary dark:border-dark-secondary">
                <h2 className="text-primary p-3 font-aladin text-lg tracking-widest">Favorite {type}</h2>
            </div>
            <table className="w-full table-auto">
                {renderTableHeader()}
                <tbody className="bg-primary">
                    {media.length > 0 ? (
                        media.map((mediaItem) => <MediaRow key={mediaItem.id} mediaItem={mediaItem} isFavorite={true} />)
                    ) : (
                        <tr>
                            <td className="p-4 text-center font-indie-flower tracking-wider text-red-500" colSpan="4">
                                No {type.toLowerCase()} favorites available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )

    // Handle favorite list rendering
    if (isFavorite) {
        return data?.anime?.length > 0 || data?.manga?.length > 0 ? (
            <>
                {data?.anime?.length > 0 && <FavoriteTable type="Anime" media={data.anime} />}
                {data?.manga?.length > 0 && <FavoriteTable type="Manga" media={data.manga} />}
            </>
        ) : (
            <NoDataCard name="favorites" message={`Add some favorite anime or manga to your list to see them here.`} />
        )
    }

    // Render regular media list (Anime/Manga)
    return data.length > 0 ? (
        data.map((list) => <MediaTable key={list.name} list={list} />)
    ) : (
        <NoDataCard name="media" message={`Add some media to your list to see them here.`} />
    )
}

export default React.memo(MediaList)
