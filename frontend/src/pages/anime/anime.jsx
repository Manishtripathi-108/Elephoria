import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import { Icon } from '@iconify/react'
import axios from 'axios'

import AnimeFilter from './components/AnimeFilter'
import AnimeHeader from './components/AnimeHeader'
import AnimeNav from './components/AnimeNav'
import MediaCardList from './components/MediaCardList'
import MediaList from './components/MediaList'

function AnimePage() {
    const [activeTab, setActiveTab] = useState('ANIME')
    const [isListView, setIsListView] = useState(true)
    const [dataList, setDataList] = useState({
        anime: [],
        manga: [],
        favorites: [],
    })
    const [currentList, setCurrentList] = useState([])
    const [error, setError] = useState(null)
    const [filteredData, setFilteredData] = useState([])

    console.log(filteredData)

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken')

        if (!accessToken) {
            setError('Access token not found. Please log in again.')
            return
        }

        // Fetch Anime Data
        const loadAnimeData = async () => {
            setError(null)
            try {
                const response = await axios.post('/api/anime/user-media', {
                    accessToken,
                })
                setDataList({ ...dataList, anime: response.data.mediaList.lists || [] }) // Handle empty lists
            } catch (error) {
                setError('Error fetching anime data.')
                console.error('Error fetching anime data:', error)
            } finally {
            }
        }

        // Fetch Manga Data
        const loadMangaData = async () => {
            setError(null)
            try {
                const response = await axios.post('/api/anime/user-media', {
                    accessToken,
                    type: 'Manga',
                })
                setDataList({ ...dataList, manga: response.data.mediaList.lists || [] }) // Handle empty lists
            } catch (error) {
                setError('Error fetching manga data.')
                console.error('Error fetching manga data:', error)
            } finally {
            }
        }

        // Fetch Favorites Data
        const loadFavoritesData = async () => {
            setError(null)
            try {
                const response = await axios.post('/api/anime/user-favorites', {
                    accessToken,
                })
                setDataList({ ...dataList, favorites: response.data.favorites || [] }) // Handle empty lists
            } catch (error) {
                setError('Error fetching favorites data.')
                console.error('Error fetching favorites data:', error)
            } finally {
            }
        }

        if (activeTab === 'ANIME') {
            loadAnimeData()
            setCurrentList(() => dataList.anime)
        } else if (activeTab === 'MANGA') {
            loadMangaData()
            setCurrentList(() => dataList.manga)
        } else if (activeTab === 'FAVORITES') {
            loadFavoritesData()
            setCurrentList(() => dataList.favorites)
        }
    }, [activeTab])

    if (error) {
        return (
            <div className="container mx-auto text-center">
                <h1 className="text-2xl text-red-500 dark:text-red-400">{error}</h1>
                <div className="flex-center mt-5">
                    <Link to="auth" className="neu-btn">
                        Go back to login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div>
            <AnimeHeader />
            <AnimeNav currentTab={setActiveTab} />

            {/* Toggle Buttons for List and Card View */}
            <div className="container mx-auto flex items-center justify-end px-4">
                {/* Display List Button */}
                <button
                    className={`text-primary neu-btn ${isListView ? 'active' : ''} rounded-lg rounded-e-none p-2 shadow-none dark:shadow-none`}
                    aria-pressed={isListView}
                    aria-label="Display as list"
                    onClick={() => setIsListView(true)}>
                    <Icon icon="tabler:list" className="size-4" />
                </button>

                {/* Display Card Button */}
                <button
                    className={`text-primary neu-btn ${!isListView ? 'active' : ''} rounded-lg rounded-s-none p-2 shadow-none dark:shadow-none`}
                    aria-pressed={!isListView}
                    aria-label="Display as card"
                    onClick={() => setIsListView(false)}>
                    <Icon icon="material-symbols:cards-outline-rounded" className="size-4" />
                </button>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto flex flex-col items-start justify-center gap-2 md:flex-row md:gap-5 md:p-5">
                {/* Anime Filter */}
                <AnimeFilter data={currentList} filteredData={setFilteredData} />

                {filteredData.length > 0 ? (
                    <>
                        {/* Conditional rendering based on the active tab and view type */}
                        {activeTab === 'ANIME' && (isListView ? <MediaList data={filteredData} /> : <MediaCardList data={filteredData} />)}

                        {activeTab === 'MANGA' && (isListView ? <MediaList data={filteredData} /> : <MediaCardList data={filteredData} />)}

                        {activeTab === 'FAVORITES' &&
                            (isListView ? (
                                <MediaList data={filteredData} isFavorite={true} />
                            ) : (
                                <MediaCardList data={filteredData} isFavorite={true} />
                            ))}
                    </>
                ) : (
                    <>
                        {/* Conditional rendering based on the active tab and view type */}
                        {activeTab === 'ANIME' && (isListView ? <MediaList data={currentList} /> : <MediaCardList data={currentList} />)}

                        {activeTab === 'MANGA' && (isListView ? <MediaList data={currentList} /> : <MediaCardList data={currentList} />)}

                        {activeTab === 'FAVORITES' &&
                            (isListView ? (
                                <MediaList data={currentList} isFavorite={true} />
                            ) : (
                                <MediaCardList data={currentList} isFavorite={true} />
                            ))}
                    </>
                )}
            </div>
        </div>
    )
}

export default AnimePage
