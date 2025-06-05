const MapaFloodAlert = {
    // Dados das áreas de risco
    areas: [
        { 
            nome: 'Zona Norte', 
            populacao: 15000, 
            risco: 'alto', 
            porcentagem: 78,
            cor: '#DC2626',
            alertas: 0
        },
        { 
            nome: 'Centro', 
            populacao: 25000, 
            risco: 'medio', 
            porcentagem: 55,
            cor: '#F59E0B',
            alertas: 0
        },
        { 
            nome: 'Zona Sul', 
            populacao: 20000, 
            risco: 'baixo', 
            porcentagem: 22,
            cor: '#10B981',
            alertas: 0
        }
    ],
    
    // Estatísticas
    stats: {
        alertasHoje: 127,
        tempoResposta: 2.3,
        pessoasProtegidas: 60000
    },
    
    // Configurações
    config: {
        alertDelay: 1500,
        animationDuration: 300,
        notificationDuration: 4000,
        updateInterval: 30000, 
        counterSpeed: 50
    }
};

const MapaUtils = {
    
    showNotification(message, type = 'success', duration = null) {
        console.log('🔔 Criando notificação:', { message, type, duration });
        
        
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        

        notification.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 9999 !important;
            padding: 16px 24px !important;
            border-radius: 12px !important;
            color: white !important;
            font-weight: 500 !important;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
            max-width: 400px !important;
            pointer-events: auto !important;
            font-family: 'Inter', sans-serif !important;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.4s ease !important;
        `;
        
        
        const colors = {
            success: 'background: linear-gradient(135deg, #10B981, #059669) !important;',
            error: 'background: linear-gradient(135deg, #DC2626, #B91C1C) !important;',
            warning: 'background: linear-gradient(135deg, #F59E0B, #D97706) !important;',
            info: 'background: linear-gradient(135deg, #3B82F6, #2563EB) !important;'
        };
        
        notification.style.cssText += colors[type] || colors.info;
        
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-triangle',
            warning: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="fas ${icons[type]}" style="font-size: 1.25rem;"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Adicionar ao body
        document.body.appendChild(notification);
        console.log('✅ Notificação adicionada ao DOM');
        
        // Animaçao entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 10);
        
        // Remover após o tempo configurado
        const timeoutDuration = duration || MapaFloodAlert.config.notificationDuration;
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                    console.log('🗑️ Notificação removida');
                }
            }, 400);
        }, timeoutDuration);
    },
    
    // Adicionar loading com texto personalizado
    addLoading(element, text = 'Enviando...') {
        element.classList.add('loading');
        element.disabled = true;
        element.dataset.originalText = element.textContent;
        element.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i>${text}`;
    },
    
    // Remover loading
    removeLoading(element) {
        element.classList.remove('loading');
        element.disabled = false;
        element.innerHTML = element.dataset.originalText || element.textContent;
    },
    
    // Formatar números
    formatNumber(num) {
        return num.toLocaleString('pt-BR');
    },
    
    // Gerar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // Calcular cor baseada no risco
    getRiskColor(percentage) {
        if (percentage >= 70) return '#DC2626';
        if (percentage >= 40) return '#F59E0B';
        return '#10B981';
    },
    
    // Simular delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// ===== GERENCIADOR DE ALERTAS =====
class AlertManager {
    constructor() {
        this.alertHistory = [];
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        console.log(' Configurando event listeners...');
        
        // Configurar botões de alerta usando data-zona
        document.querySelectorAll('.alert-button').forEach(button => {
            button.addEventListener('click', this.handleAlertClick.bind(this));
        });
        
        // Configurar botão de alerta geral
        const alertaGeralBtn = document.getElementById('alerta-geral-btn');
        if (alertaGeralBtn) {
            alertaGeralBtn.addEventListener('click', this.simularAlertaTotal.bind(this));
        }
        
        console.log('Event listeners configurados');
    }
    
    async handleAlertClick(event) {
        event.preventDefault();
        const button = event.currentTarget;
        
        // Método mais confiável para obter a zona
        let zona = button.dataset.zona;
        
        // Fallback: tentar extrair do card
        if (!zona) {
            const card = button.closest('.risk-card');
            if (card) {
                const titleElement = card.querySelector('h2');
                if (titleElement) {
                    zona = titleElement.textContent.trim();
                }
            }
        }
        
        console.log('Zona detectada:', zona);
        
        if (zona) {
            await this.enviarAlerta(zona, button);
        } else {
            console.error('Não foi possível detectar a zona do botão');
            MapaUtils.showNotification('Erro: Zona não identificada', 'error');
        }
    }
    
    async enviarAlerta(zona, button = null) {
        console.log('Enviando alerta para:', zona);
        
        if (button) {
            MapaUtils.addLoading(button, 'Enviando Alerta...');
        }
        
        // Encontrar dados da área
        const area = MapaFloodAlert.areas.find(a => a.nome === zona);
        
        try {
            // Simular envio
            await MapaUtils.delay(MapaFloodAlert.config.alertDelay);
            
            if (area) {
                // Incrementar contador de alertas
                area.alertas++;
                MapaFloodAlert.stats.alertasHoje++;
                
                // Mostrar notificação de sucesso
                MapaUtils.showNotification(
                    `Alerta enviado para ${MapaUtils.formatNumber(area.populacao)} moradores da ${zona}!`, 
                    'warning'
                );
                
                // Adicionar ao histórico
                this.addToHistory(zona, area.populacao, area.risco);
                
                // Atualizar estatísticas na tela
                this.updateStats();
                
                // Simular evacuação se for alto risco
                if (area.risco === 'alto') {
                    setTimeout(() => {
                        MapaUtils.showNotification(
                            'Evacuação necessária! Rotas de fuga ativadas.', 
                            'error'
                        );
                    }, 2000);
                }
                
                // Log detalhado
                console.log(`Alerta enviado:`, {
                    zona: zona,
                    populacao: area.populacao,
                    risco: area.risco,
                    timestamp: new Date().toISOString(),
                    alertNumber: area.alertas
                });
                
            } else {
                throw new Error('Zona não encontrada');
            }
            
        } catch (error) {
            console.error('Erro ao enviar alerta:', error);
            MapaUtils.showNotification('Erro ao enviar alerta: ' + error.message, 'error');
        } finally {
            if (button) {
                MapaUtils.removeLoading(button);
            }
        }
    }
    
    async simularAlertaTotal(event) {
        event.preventDefault();
        const button = event.currentTarget;
        console.log('Simulando alerta geral...');
        
        MapaUtils.addLoading(button, 'Enviando Alerta Geral...');
        
        try {
            // Simular envio para todas as áreas
            await MapaUtils.delay(2000);
            
            let totalPessoas = 0;
            MapaFloodAlert.areas.forEach(area => {
                area.alertas++;
                totalPessoas += area.populacao;
            });
            
            MapaFloodAlert.stats.alertasHoje += 3;
            
            MapaUtils.showNotification(
                `Alerta geral enviado para ${MapaUtils.formatNumber(totalPessoas)} pessoas em todas as zonas de risco!`, 
                'info'
            );
            
            // Adicionar múltiplas entradas ao histórico
            this.addToHistory('Todas as Zonas', totalPessoas, 'geral');
            
            // Atualizar estatísticas
            this.updateStats();
            
            // Simular progresso de envio
            this.simulateProgress();
            
        } catch (error) {
            console.error('Erro ao enviar alerta geral:', error);
            MapaUtils.showNotification('Erro ao enviar alerta geral: ' + error.message, 'error');
        } finally {
            MapaUtils.removeLoading(button);
        }
    }
    
    simulateProgress() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 20;
            console.log(`Progresso do alerta geral: ${progress}%`);
            
            if (progress >= 100) {
                clearInterval(interval);
                MapaUtils.showNotification('Todos os moradores foram notificados!', 'success');
            }
        }, 800);
    }
    
    addToHistory(zona, populacao, risco) {
        const update = {
            id: MapaUtils.generateId(),
            zona: zona,
            populacao: populacao,
            risco: risco,
            timestamp: new Date(),
            tipo: (risco === 'geral' || zona === 'Todas as Zonas') ? 'Alerta Geral' : 'Alerta de Zona'
        };
        
        this.alertHistory.unshift(update);
        
        // Manter apenas os últimos 10 alertas
        if (this.alertHistory.length > 10) {
            this.alertHistory = this.alertHistory.slice(0, 10);
        }
        
        this.updateRealtimeSection();
    }
    
    updateRealtimeSection() {
        const container = document.getElementById('updates-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (this.alertHistory.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <i class="fas fa-clock text-3xl mb-3"></i>
                    <p>Nenhum alerta enviado ainda hoje.</p>
                </div>
            `;
            return;
        }
        
        this.alertHistory.forEach((update, index) => {
            const updateElement = document.createElement('div');
            updateElement.className = `update-item ${index === 0 ? 'new' : ''}`;
            
            const timeString = update.timestamp.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            const riskIcons = {
                'alto': 'fa-exclamation-triangle text-red-500',
                'medio': 'fa-exclamation-circle text-yellow-500',
                'baixo': 'fa-info-circle text-green-500',
                'geral': 'fa-bullhorn text-blue-500'
            };
            
            updateElement.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <i class="fas ${riskIcons[update.risco]}"></i>
                        <div>
                            <span class="font-semibold">${update.tipo}</span>
                            <span class="text-gray-600">- ${update.zona}</span>
                        </div>
                    </div>
                    <div class="text-right text-sm text-gray-500">
                        <div>${MapaUtils.formatNumber(update.populacao)} pessoas</div>
                        <div>${timeString}</div>
                    </div>
                </div>
            `;
            
            container.appendChild(updateElement);
        });
    }
    
    updateStats() {
        // Atualizar contador de alertas
        const alertCounter = document.querySelector('.counter[data-target="127"]');
        if (alertCounter) {
            this.animateCounter(alertCounter, MapaFloodAlert.stats.alertasHoje);
        }
    }
    
    animateCounter(element, target) {
        const start = parseInt(element.textContent) || 0;
        const increment = Math.ceil((target - start) / 20);
        let current = start;
        
        element.classList.add('counting');
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                element.classList.remove('counting');
            }
            element.textContent = current;
        }, MapaFloodAlert.config.counterSpeed);
    }
}

// ===== GERENCIADOR DE ANIMAÇÕES =====
class AnimationManager {
    constructor() {
        this.setupScrollAnimations();
        this.setupCounters();
        this.setupHoverEffects();
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    
                    // Animar barras de risco
                    const riskBars = entry.target.querySelectorAll('.risk-progress');
                    riskBars.forEach(bar => {
                        setTimeout(() => {
                            bar.style.width = bar.style.width || '0%';
                        }, 500);
                    });
                }
            });
        }, observerOptions);
        
        // Observar elementos que devem animar
        const animatedElements = document.querySelectorAll('.risk-card, .stat-card, .summary-card');
        animatedElements.forEach(el => observer.observe(el));
    }
    
    setupCounters() {
        const counters = document.querySelectorAll('.counter, .population-counter');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => counterObserver.observe(counter));
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.target) || 0;
        const isPopulation = element.classList.contains('population-counter');
        let current = 0;
        const increment = Math.ceil(target / 100);
        
        element.classList.add('counting');
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
                element.classList.remove('counting');
            }
            
            if (isPopulation) {
                element.textContent = `${MapaUtils.formatNumber(current)} Pessoas`;
            } else {
                element.textContent = current;
            }
        }, MapaFloodAlert.config.counterSpeed);
    }
    
    setupHoverEffects() {
        // Adicionar efeitos hover aos cards
        const cards = document.querySelectorAll('.risk-card, .stat-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }
}

// ===== SIMULADOR DE DADOS EM TEMPO REAL =====
class RealTimeSimulator {
    constructor() {
        this.isRunning = false;
        this.startSimulation();
    }
    
    startSimulation() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        
        // Simular atualizações periódicas
        setInterval(() => {
            this.updateRiskPercentages();
        }, MapaFloodAlert.config.updateInterval);
        
        // Simular alertas automáticos ocasionais
        setInterval(() => {
            if (Math.random() < 0.1) {
                this.simulateAutoAlert();
            }
        }, 60000);
    }
    
    updateRiskPercentages() {
        MapaFloodAlert.areas.forEach((area, index) => {
            // Pequena variação aleatória na porcentagem de risco
            const variation = (Math.random() - 0.5) * 4; 
            const newPercentage = Math.max(0, Math.min(100, area.porcentagem + variation));
            
            area.porcentagem = Math.round(newPercentage);
            
            // Atualizar na interface
            const card = document.getElementById(`area-card-${area.nome.toLowerCase().replace(' ', '-')}`);
            if (card) {
                const percentageElement = card.querySelector('.risk-percentage');
                const progressBar = card.querySelector('.risk-progress');
                
                if (percentageElement) {
                    percentageElement.textContent = `${area.porcentagem}%`;
                }
                
                if (progressBar) {
                    progressBar.style.width = `${area.porcentagem}%`;
                }
            }
        });
    }
    
    simulateAutoAlert() {
        const highRiskAreas = MapaFloodAlert.areas.filter(area => area.porcentagem > 70);
        
        if (highRiskAreas.length > 0) {
            const randomArea = highRiskAreas[Math.floor(Math.random() * highRiskAreas.length)];
            
            MapaUtils.showNotification(
                `Alerta automático: Risco elevado detectado na ${randomArea.nome} (${randomArea.porcentagem}%)`,
                'warning'
            );
        }
    }
}


// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('FloodAlert Mapa System Initialized');
    
    // Inicializar módulos
    window.alertManager = new AlertManager();
    window.animationManager = new AnimationManager();
    window.realTimeSimulator = new RealTimeSimulator();
    
    // Adicionar animação inicial
    document.body.classList.add('animate-fade-in');
    
    // Log de estatísticas
    console.log('Áreas monitoradas:', MapaFloodAlert.areas.length);
    console.log('População total:', MapaUtils.formatNumber(
        MapaFloodAlert.areas.reduce((sum, area) => sum + area.populacao, 0)
    ));
    console.log('⚠️ Áreas de alto risco:', 
        MapaFloodAlert.areas.filter(area => area.risco === 'alto').length
    );
    
    // Simular carregamento inicial dos dados
    setTimeout(() => {
        MapaUtils.showNotification('Sistema de monitoramento ativo', 'info', 2000);
    }, 1000);
});
window.MapaFloodAlert = MapaFloodAlert;
window.MapaUtils = MapaUtils;
