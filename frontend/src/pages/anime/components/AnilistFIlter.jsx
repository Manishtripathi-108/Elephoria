import React from 'react'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import TabNavigation from '../../../components/common/TabNavigation'
import JelloButton from '../../../components/common/buttons/JelloButton'
import { FILTER_OPTIONS } from '../../../constants/anilist'

const AnilistFilter = ({ filters, setFilters }) => {
    const formik = useFormik({
        initialValues: {
            format: filters.format || null,
            genres: filters.genres || [],
            year: filters.year || '',
            status: filters.status || null,
            sort: filters.sort || '',
        },
        validationSchema: Yup.object({
            year: Yup.number().min(1900).max(new Date().getFullYear()).nullable(),
            sort: Yup.string().oneOf(FILTER_OPTIONS.sort),
            genres: Yup.array().of(Yup.string().oneOf(FILTER_OPTIONS.genres)),
        }),
        onSubmit: (values) => {
            setFilters(values)
        },
    })

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6 rounded-lg bg-inherit p-6 shadow-lg">
            {/* Format */}
            <div className="form-group relative">
                <label htmlFor="format" className="form-text text-primary text-base">
                    Format:
                </label>
                <TabNavigation
                    tabs={FILTER_OPTIONS.format}
                    currentTab={formik.values.format}
                    className="w-full text-nowrap"
                    setCurrentTab={(format) => formik.setFieldValue('format', format)}
                />
                <button
                    type="button"
                    className="text-secondary hover:text-primary absolute -top-2 right-4 cursor-pointer text-2xl"
                    onClick={() => formik.setFieldValue('format', null)}
                    title="Clear">
                    x
                </button>
            </div>

            {/* Genres */}
            <div>
                <label className="form-text text-primary text-base">Genres:</label>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {FILTER_OPTIONS.genres.map((genre) => (
                        <label key={genre} className="form-checkbox">
                            <input
                                type="checkbox"
                                value={genre}
                                checked={formik.values.genres.includes(genre)}
                                onChange={(e) => {
                                    const updatedGenres = e.target.checked
                                        ? [...formik.values.genres, genre]
                                        : formik.values.genres.filter((g) => g !== genre)
                                    formik.setFieldValue('genres', updatedGenres)
                                }}
                                className="checkbox-field"
                            />
                            <span className="form-text">{genre}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Status */}
            <div className="form-group relative">
                <label className="form-text text-primary text-base">Status:</label>
                <TabNavigation
                    tabs={FILTER_OPTIONS.status}
                    currentTab={formik.values.status}
                    className="w-full text-nowrap"
                    setCurrentTab={(status) => formik.setFieldValue('status', status)}
                />
                <button
                    type="button"
                    className="text-secondary hover:text-primary absolute -top-2 right-4 cursor-pointer text-2xl"
                    onClick={() => formik.setFieldValue('status', null)}
                    title="Clear">
                    x
                </button>
            </div>

            {/* Sort */}
            <div className="flex gap-4">
                <div className="form-group">
                    <label htmlFor="sort" className="form-text text-primary text-base">
                        Sort By:
                    </label>
                    <select id="sort" name="sort" value={formik.values.sort} onChange={formik.handleChange} className="form-field">
                        <option value="">Default</option>
                        {FILTER_OPTIONS.sort.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <p className="form-text text-red-500 dark:text-red-500">{formik.errors.sort}</p>
                </div>

                {/* Year */}
                <div className="form-group">
                    <label htmlFor="year" className="form-text text-primary text-base">
                        Year:
                    </label>
                    <input
                        id="year"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        name="year"
                        value={formik.values.year}
                        onChange={formik.handleChange}
                        placeholder="e.g., 2022"
                        className="form-field"
                    />
                    <p className="form-text text-red-500 dark:text-red-500">{formik.errors.year}</p>
                </div>
            </div>
            <div className="flex items-center justify-end gap-4">
                <JelloButton type="submit">Apply Filters</JelloButton>

                <JelloButton onClick={formik.resetForm} variant="danger">
                    Clear Filters
                </JelloButton>
            </div>
        </form>
    )
}

export default AnilistFilter
