tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                "inter": ["Inter", "sans-serif"],
                "sans": ["Inter", "sans-serif"]
            },
            colors: {
                "primary": "#1D4ED8",
                "secondary": "#1E40AF", 
                "danger": "#DC2626",
                "warning": "#F59E0B",
                "success": "#10B981",
                "info": "#3B82F6"
            },
            animation: {
                'fade-in': 'fadeIn 0.8s ease-in-out',
                'slide-up': 'slideUp 0.6s ease-out',
                'pulse-custom': 'pulseCustom 2s infinite',
                'shimmer': 'shimmer 2s infinite',
                'rotate': 'rotate 20s linear infinite',
                'urgent-pulse': 'urgentPulse 1s infinite',
                'icon-pulse': 'iconPulse 2s infinite',
                'btn-pulse': 'btnPulse 3s infinite',
                'slide-in-left': 'slideInLeft 0.5s ease',
                'slide-in-right': 'slideInRight 0.4s ease',
                'new-update': 'newUpdate 0.8s ease'
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(50px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                pulseCustom: {
                    '0%': { boxShadow: '0 0 0 0 rgba(29, 78, 216, 0.7)' },
                    '70%': { boxShadow: '0 0 0 10px rgba(29, 78, 216, 0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(29, 78, 216, 0)' }
                },
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' }
                },
                rotate: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                },
                urgentPulse: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' }
                },
                iconPulse: {
                    '0%, 100%': { transform: 'scale(1)', opacity: '1' },
                    '50%': { transform: 'scale(1.1)', opacity: '0.8' }
                },
                btnPulse: {
                    '0%': { boxShadow: '0 0 0 0 rgba(29, 78, 216, 0.7)' },
                    '70%': { boxShadow: '0 0 0 15px rgba(29, 78, 216, 0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(29, 78, 216, 0)' }
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' }
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(100%)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' }
                },
                newUpdate: {
                    '0%': { background: '#ECFDF5', transform: 'scale(1.02)' },
                    '50%': { background: '#D1FAE5' },
                    '100%': { background: '#ECFDF5', transform: 'scale(1)' }
                }
            }
        }
    }
};