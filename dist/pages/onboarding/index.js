import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
export function OnboardingWizard() {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [voice, setVoice] = useState('sage');
    const [element, setElement] = useState('Aether');
    const navigate = useNavigate();
    const completeProfile = async () => {
        const user = supabase.auth.user();
        if (!user)
            return alert('Not logged in');
        const { error } = await supabase
            .from('profiles')
            .insert([{ user_id: user.id, name, voice, element, onboarding_complete: true }]);
        if (error)
            return alert(error.message);
        navigate('/dashboard');
    };
    return (_jsxs("div", { className: "max-w-lg mx-auto p-6 space-y-6", children: [step === 1 && (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-xl font-semibold", children: "1. What\u2019s your name?" }), _jsx("input", { value: name, onChange: e => setName(e.target.value), placeholder: "Your name", className: "w-full border p-2 rounded" }), _jsx("button", { disabled: !name, onClick: () => setStep(2), className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50", children: "Next" })] })), step === 2 && (_jsxs(_Fragment, { children: [_jsx("h2", { className: "text-xl font-semibold", children: "2. Choose your voice & element" }), _jsxs("select", { value: voice, onChange: e => setVoice(e.target.value), className: "w-full border p-2 rounded", children: [_jsx("option", { value: "sage", children: "Sage Whisper" }), _jsx("option", { value: "mystic", children: "Mystic Flow" }), _jsx("option", { value: "celestial", children: "Celestial Guide" })] }), _jsxs("select", { value: element, onChange: e => setElement(e.target.value), className: "w-full border p-2 rounded mt-4", children: [_jsx("option", { children: "Fire" }), _jsx("option", { children: "Water" }), _jsx("option", { children: "Earth" }), _jsx("option", { children: "Air" }), _jsx("option", { children: "Aether" })] }), _jsx("button", { onClick: completeProfile, className: "mt-4 px-4 py-2 bg-green-600 text-white rounded", children: "Finish Onboarding" })] }))] }));
}
