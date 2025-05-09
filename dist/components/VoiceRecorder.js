"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ReactMic } from "react-mic";
const onTranscription = (text, { emotion, element, phase }) => {
    console.log({ text, emotion, element, phase });
    // Optionally: auto-submit to Oracle!
};
export default function VoiceRecorder({ onTranscription }) {
    const [recording, setRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleStart = () => setRecording(true);
    const handleStop = () => setRecording(false);
    const onStop = async (recordedBlob) => {
        setLoading(true);
        const formData = new FormData();
        formData.append("audio", recordedBlob.blob, "recording.webm");
        try {
            const response = await fetch("/api/transcribe", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (data?.text) {
                const { text, emotion, element, phase } = data;
                onTranscription(text, { emotion, element, phase });
            }
        }
        catch (err) {
            console.error("Transcription failed:", err);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "p-4 rounded-xl border shadow space-y-3 bg-white", children: [_jsx(ReactMic, { record: recording, className: "w-full", onStop: onStop, mimeType: "audio/webm", strokeColor: "#000000", backgroundColor: "#eee" }), _jsx("button", { onClick: recording ? handleStop : handleStart, disabled: loading, className: `w-full p-2 rounded text-white ${recording
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-emerald-600 hover:bg-emerald-700"}`, children: loading
                    ? "Analyzing..."
                    : recording
                        ? "Stop Recording"
                        : "Start Recording" })] }));
}
