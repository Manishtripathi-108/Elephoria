import React from 'react'

import { Icon } from '@iconify/react'

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const convertMonthNumberToName = (monthNumber) => {
    if (monthNumber >= 1 && monthNumber <= 12) {
        return monthNames[monthNumber - 1]
    }
    return '...'
}

function AnimeCards({ anime }) {
    return (
        <div className="group relative rounded-xl border border-light-secondary shadow-neu-light-sm dark:border-dark-secondary dark:shadow-neu-dark-sm">
            <img
                className="text-secondary h-40 w-full rounded-t-xl border-b border-light-secondary object-cover dark:border-dark-secondary md:h-64"
                src={anime.coverImage.large}
                alt={anime.title.english}
            />

            <div className="p-2">
                <h2 className="text-primary line-clamp-1 font-aladin text-sm font-normal capitalize leading-none tracking-widest">
                    {anime.title.english}
                </h2>
                <span className="text-secondary text-xs">{anime.format}</span>
                <span className="text-secondary ml-2 text-xs">&#9679;</span>
                <span className="text-secondary ml-2 text-xs">{anime.episodes}</span>
            </div>

            {/* Description Popup: */}
            <div
                className="absolute inset-x-1/2 top-1/3 z-10 hidden w-72 rounded-xl border border-light-secondary bg-light-primary/60 p-3 opacity-0 backdrop-blur-md backdrop-saturate-150 transition-opacity duration-300 ease-in-out group-hover:block group-hover:opacity-100 dark:border-dark-secondary dark:bg-dark-primary/50"
                aria-hidden="true"
                aria-label="Anime Description Popup">
                {/* Title Section */}
                <div className="mb-2">
                    <h3 className="text-primary font-aladin text-xl font-bold tracking-widest" aria-live="polite">
                        {anime.title.english}
                    </h3>
                </div>

                {/* Description Section */}
                <p className="text-secondary mb-3 line-clamp-5 font-indie-flower text-sm" aria-live="polite">
                    After graduating from a top university with an impressive extracurricular record in the rugby club, Akira Tendou has nailed every
                    step of the way to securing his dream job. On top of that, a beautiful and kind co-worker always brightens his day in the office!
                    Life seems to be going very well for Akira until he slowly realizes that sleepless nights and brutal work are his new reality. Due
                    to three years of mind-numbing labor in an exploitative company, Akira is unable to recognize the tired, unaccomplished person he
                    has become. On track to losing all passion in life like several of his overworked colleagues, Akira finds his saving grace in the
                    most unexpected way possible—the breakout of a zombie apocalypse. With the free time he finally has, Akira decides to complete a
                    bucket list of a hundred things he wants to do before he eventually gets turned into a zombie. Although he is surrounded by the
                    dead, Akira has never felt more alive!
                </p>

                {/* Additional Info */}
                <div className="text-secondary mb-4 space-y-1 font-indie-flower text-xs">
                    <p>
                        <strong className="text-primary">Japanese: </strong> {anime.title.native}
                    </p>
                    <p>
                        <strong className="text-primary">Aired: </strong>
                        {anime.startDate.day + ' ' + convertMonthNumberToName(anime.startDate.month) + ' ' + anime.startDate.year}
                    </p>
                    <p>
                        <strong className="text-primary">Status: </strong> {anime.status}
                    </p>
                    <p>
                        <strong className="text-primary">Genres: </strong> {anime.genres.join(', ')}
                    </p>
                </div>
            </div>

            {/* Dots Menu */}
            <button type="button" className="bg-secondary text-secondary absolute right-1 top-1 flex items-center justify-center rounded-lg p-0.5">
                <Icon icon="pepicons-pop:dots-y" className="size-6" />
            </button>
        </div>
    )
}

export default AnimeCards
