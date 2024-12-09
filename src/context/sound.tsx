import React, {createContext, useCallback, useContext, useMemo} from 'react'
import useSound from "use-sound";
import startSound from '@/assets/sound/start.mp3';
import complSound from '@/assets/sound/end.mp3';
import duplicateCode from '@/assets/sound/duplicate-code.mp3';
import incorrect_prepare_code from '@/assets/sound/incorrect_prepare_code.mp3';

const SoundContext = createContext<any>(null);

const SoundProvider = ({children}: { children: React.ReactNode }) => {
    // @ts-ignore
    const [playStart, {stop}] = useSound(startSound);
    // @ts-ignore
    const [playEnd] = useSound(complSound);
    const [playDup] = useSound(duplicateCode);
    const [playIcPrepareCode] = useSound(incorrect_prepare_code);

    const playByType = useCallback((type: 'start' | 'end' | 'dup' | 'ic_prepare_code') => {
        if (type === 'start')
            playStart()
        else if (type === 'end') {
            playEnd()
        } else if (type === 'dup') {
            playDup()
        } else if (type === 'ic_prepare_code') {
            playIcPrepareCode()
        }
    }, [playStart, playEnd, playDup])

    const contextValue = useMemo(
        () => ({
            playByType,
        }),
        [playByType]
    );

    return (
        <SoundContext.Provider value={contextValue}>{children}</SoundContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSoundCustom: () => ({ playByType: (type: 'start' | 'end' | 'dup' | 'ic_prepare_code') => void }) = () => {
    return useContext(SoundContext);
};

export default SoundProvider;