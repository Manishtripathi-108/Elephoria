import { useState } from 'react'

import { ErrorMessage, Field, Form, Formik } from 'formik'
import { AnimatePresence, motion } from 'motion/react'

import TabNavigation from '../../components/common/TabNavigation'
import JelloButton from '../../components/common/buttons/JelloButton'
import {
    AUDIO_OPTIONS_INITIAL_VALUES,
    SUPPORTED_CHANNELS,
    SUPPORTED_PLAYBACK_SPEEDS,
    SUPPORTED_SAMPLE_RATES,
    audioOptionsValidationSchema,
} from '../../constants/audio.constants'

const AudioOptions = ({ values, onApply }) => {
    const [currentTab, setCurrentTab] = useState('Audio')

    if (!values) {
        return null
    }

    const mergedValues = {
        ...AUDIO_OPTIONS_INITIAL_VALUES,
        audio: { ...AUDIO_OPTIONS_INITIAL_VALUES.audio, ...(values?.audio || {}) },
        effects: { ...AUDIO_OPTIONS_INITIAL_VALUES.effects, ...(values?.effects || {}) },
        trim: { ...AUDIO_OPTIONS_INITIAL_VALUES.trim, ...(values?.trim || {}) },
    }

    return (
        <Formik initialValues={mergedValues} enableReinitialize validationSchema={audioOptionsValidationSchema} onSubmit={onApply}>
            {({ errors, touched, resetForm }) => (
                <Form className="p-6">
                    <TabNavigation
                        tabs={['Audio', 'Effects', 'Trim']}
                        className="mx-auto w-19/20"
                        currentTab={currentTab}
                        onTabChange={setCurrentTab}
                    />

                    <div className="h-56">
                        <AnimatePresence mode="wait">
                            {currentTab === 'Audio' && (
                                <motion.div
                                    key="audioTab"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}>
                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div className="form-group">
                                            <label htmlFor="audio.channels" className="form-text">
                                                Channels
                                            </label>
                                            <Field
                                                as="select"
                                                data-error={!!(touched.audio?.channels && errors.audio?.channels)}
                                                name="audio.channels"
                                                id="audio.channels"
                                                className="form-field mt-1">
                                                {SUPPORTED_CHANNELS.map((channel, index) => (
                                                    <option key={index} value={index}>
                                                        {channel}
                                                    </option>
                                                ))}
                                            </Field>
                                            <p className="form-text">Convert the audio to mono/stereo.</p>
                                            <ErrorMessage name="audio.channels" component="p" className="text-sm text-red-500" />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="audio.volume" className="form-text">
                                                Volume
                                            </label>
                                            <Field
                                                type="number"
                                                data-error={!!(touched.audio?.volume && errors.audio?.volume)}
                                                name="audio.volume"
                                                id="audio.volume"
                                                className="form-field mt-1"
                                                placeholder="100%"
                                                min="0"
                                                max="500"
                                            />
                                            <p className="form-text">Adjust audio loudness (default is 100%).</p>
                                            <ErrorMessage name="audio.volume" component="p" className="text-sm text-red-500" />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="audio.sampleRate" className="form-text">
                                                Sample Rate
                                            </label>
                                            <Field
                                                as="select"
                                                data-error={!!(touched.audio?.sampleRate && errors.audio?.sampleRate)}
                                                name="audio.sampleRate"
                                                id="audio.sampleRate"
                                                className="form-field mt-1">
                                                {SUPPORTED_SAMPLE_RATES.map((rate) => (
                                                    <option key={rate} value={rate}>
                                                        {rate}
                                                    </option>
                                                ))}
                                            </Field>
                                            <p className="form-text">Set the audio sampling frequency.</p>
                                            <ErrorMessage name="audio.sampleRate" component="p" className="text-sm text-red-500" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentTab === 'Effects' && (
                                <motion.div
                                    key="effectsTab"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}>
                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div className="form-group">
                                            <label htmlFor="effects.fadeIn" className="form-text">
                                                Fade In (seconds)
                                            </label>
                                            <Field
                                                type="number"
                                                data-error={!!(touched.effects?.fadeIn && errors.effects?.fadeIn)}
                                                name="effects.fadeIn"
                                                id="effects.fadeIn"
                                                className="form-field mt-1"
                                                placeholder="0%"
                                            />
                                            <ErrorMessage name="effects.fadeIn" component="p" className="text-sm text-red-500" />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="effects.fadeOut" className="form-text">
                                                Fade Out (seconds)
                                            </label>
                                            <Field
                                                type="number"
                                                data-error={!!(touched.effects?.fadeOut && errors.effects?.fadeOut)}
                                                name="effects.fadeOut"
                                                id="effects.fadeOut"
                                                className="form-field mt-1"
                                                placeholder="0%"
                                            />
                                            <ErrorMessage name="effects.fadeOut" component="p" className="text-sm text-red-500" />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="effects.playbackSpeed" className="form-text">
                                                Playback Speed
                                            </label>
                                            <Field
                                                as="select"
                                                data-error={!!(touched.effects?.playbackSpeed && errors.effects?.playbackSpeed)}
                                                name="effects.playbackSpeed"
                                                id="effects.playbackSpeed"
                                                className="form-field mt-1">
                                                {SUPPORTED_PLAYBACK_SPEEDS.map((speed) => (
                                                    <option key={speed} value={speed}>
                                                        {speed}
                                                    </option>
                                                ))}
                                            </Field>
                                            <ErrorMessage name="effects.playbackSpeed" component="p" className="text-sm text-red-500" />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="effects.pitchShift" className="form-text">
                                                Pitch Shift
                                            </label>
                                            <Field
                                                type="number"
                                                data-error={!!(touched.effects?.pitchShift && errors.effects?.pitchShift)}
                                                name="effects.pitchShift"
                                                id="effects.pitchShift"
                                                className="form-field mt-1"
                                                placeholder="0%"
                                            />
                                            <p className="form-text">Change pitch in semitones (-12 to +12).</p>
                                            <ErrorMessage name="effects.pitchShift" component="p" className="text-sm text-red-500" />
                                        </div>

                                        <div className="form-checkbox">
                                            <Field
                                                type="checkbox"
                                                data-error={!!(touched.effects?.normalize && errors.effects?.normalize)}
                                                name="effects.normalize"
                                                className="checkbox-field"
                                                id="normalize"
                                            />
                                            <label htmlFor="normalize" className="form-text text-base">
                                                Normalize Audio
                                            </label>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentTab === 'Trim' && (
                                <motion.div
                                    key="trimTab"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}>
                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div className="form-group">
                                            <label htmlFor="trim.trimStart" className="form-text">
                                                Trim Start
                                            </label>
                                            <Field
                                                type="text"
                                                data-error={!!(touched.trim?.trimStart && errors.trim?.trimStart)}
                                                name="trim.trimStart"
                                                id="trim.trimStart"
                                                className="form-field mt-1"
                                                placeholder="00:00:00"
                                            />
                                            <p className="form-text">Set the start time of the trimmed audio.</p>
                                            <ErrorMessage name="trim.trimStart" component="p" className="text-sm text-red-500" />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="trim.trimEnd" className="form-text">
                                                Trim End
                                            </label>
                                            <Field
                                                type="text"
                                                data-error={!!(touched.trim?.trimEnd && errors.trim?.trimEnd)}
                                                name="trim.trimEnd"
                                                id="trim.trimEnd"
                                                className="form-field mt-1"
                                                placeholder="00:00:00"
                                            />
                                            <p className="form-text">Set the end time of the trimmed audio.</p>
                                            <ErrorMessage name="trim.trimEnd" component="p" className="text-sm text-red-500" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-4 flex justify-between border-t px-4 pt-4">
                        <JelloButton variant="danger" title="Reset" type="button" onClick={resetForm}>
                            Reset
                        </JelloButton>

                        <JelloButton title="Apply Changes" variant="info" type="submit">
                            Apply Changes
                        </JelloButton>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

export default AudioOptions
