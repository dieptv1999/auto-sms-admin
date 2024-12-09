import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/components/language-provider'
import router from '@/router'
import '@/index.css'
import { TooltipProvider } from './components/ui/tooltip'
import SoundProvider from "@/context/sound.tsx";
import AuthProvider from "@/context/auth.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <TooltipProvider>
            <SoundProvider>
                <AuthProvider>
                    <LanguageProvider defaultLanguage='en' storageKey='vite-ui-language'>
                        <RouterProvider router={router} />
                        <Toaster />
                    </LanguageProvider>
                </AuthProvider>
            </SoundProvider>
        </TooltipProvider>
    </ThemeProvider>
)
