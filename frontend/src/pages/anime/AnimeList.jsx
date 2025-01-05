import React from 'react'

import { useOutletContext } from 'react-router-dom'

import { Icon } from '@iconify/react'

const AnimeList = () => {
    // const { watchList } = useOutletContext();
    const watchList = [
        {
            title: 'Trapped in a Dating Sim',
            img: 'https://picsum.photos/200/300',
            type: 'TV',
            duration: '24m',
            subs: 12,
            dubs: 12,
        },
        {
            title: 'Rurouni Kenshin: Meiji',
            img: 'https://picsum.photos/200/300',
            type: 'TV',
            duration: '22m',
            subs: 24,
            dubs: 24,
        },
        {
            title: 'Bleach',
            img: 'https://picsum.photos/200/300',
            type: 'TV',
            duration: '24m',
            subs: 366,
            dubs: 366,
        },
        {
            title: 'Gokushufudou Part 2',
            img: 'https://picsum.photos/600/300',
            type: 'ONA',
            duration: '17m',
            subs: 5,
            dubs: 5,
        },
        {
            title: 'The Way of the Househusband',
            img: 'https://picsum.photos/300/200',
            type: 'ONA',
            duration: '17m',
            subs: 5,
            dubs: 5,
        },
    ]
    return (
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 sm:gap-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {watchList.map((item, index) => (
                <div key={index} className="relative overflow-hidden rounded-lg bg-gray-800 shadow-lg">
                    <img src={item.img} alt={item.title} className="h-48 w-full object-cover" />
                    <div className="p-4">
                        <h3 className="text-lg font-bold">{item.title}</h3>
                        <p className="text-sm text-gray-400">
                            {item.type} • {item.duration}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="flex items-center gap-1 text-gray-400">
                                <Icon icon="mdi:subtitles-outline" /> {item.subs}
                            </span>
                            <span className="flex items-center gap-1 text-gray-400">
                                <Icon icon="mdi:volume-high" /> {item.dubs}
                            </span>
                        </div>
                    </div>
                    {/* Options */}
                    <button className="absolute right-2 top-2 rounded-full bg-gray-700 p-1 hover:bg-gray-600">
                        <Icon icon="mdi:dots-vertical" />
                    </button>
                </div>
            ))}
        </div>
    )
}

export default AnimeList
