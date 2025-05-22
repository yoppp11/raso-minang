import React from 'react'

interface SocialLoginButtonProps {
    provider: 'google' | 'facebook'
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({ provider }) => {
    const icons = {
        google: (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
        ),
        facebook: (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M18.896 0H1.104C.494 0 0 .494 0 1.104v17.793C0 19.506.494 20 1.104 20h9.58v-7.745H8.076V9.237h2.606V7.01c0-2.583 1.578-3.99 3.883-3.99 1.104 0 2.052.082 2.329.119v2.7h-1.598c-1.254 0-1.496.597-1.496 1.47v1.928h2.989l-.39 3.018h-2.6V20h5.098c.608 0 1.102-.494 1.102-1.104V1.104C20 .494 19.506 0 18.896 0z" />
            </svg>
        )
    }
    
    const providerText = {
        google: 'Google',
        facebook: 'Facebook'
    }
    
    const handleClick = () => {
        // Here you would implement the actual social login functionality
        console.log(`Login with ${provider}`)
    }
    
    return (
        <button
            type="button"
            onClick={handleClick}
            className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
            {icons[provider]}
            <span className="ml-2">{providerText[provider]}</span>
        </button>
    )
}

export default SocialLoginButton