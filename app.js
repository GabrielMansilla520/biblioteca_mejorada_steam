import { createApp, ref, computed } from 'vue';

createApp({
    setup() {
        const games = ref([]);
        const searchQuery = ref('');
        const sortBy = ref('name');
        const selectedGame = ref(null);
        const detailsPosition = ref({});

        // Función para cargar los juegos
        const loadGames = async () => {
            const apiKey = "D00E3E9FC27F147B5CBB0F6A2209AE48";
            const steamId = "76561198817285642";
            const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json&include_appinfo=true&include_played_free_games=true`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                games.value = data.response.games;
            } catch (error) {
                console.error("Error al cargar los juegos:", error);
            }
        };

        // Filtrar y ordenar juegos
        const filteredGames = computed(() => {
            let filtered = [...games.value];
            
            if (searchQuery.value) {
                filtered = filtered.filter(game => 
                    game.name.toLowerCase().includes(searchQuery.value.toLowerCase())
                );
            }

            switch (sortBy.value) {
                case 'playtime':
                    filtered.sort((a, b) => b.playtime_forever - a.playtime_forever);
                    break;
                case 'recent':
                    filtered.sort((a, b) => (b.playtime_2weeks || 0) - (a.playtime_2weeks || 0));
                    break;
                default:
                    filtered.sort((a, b) => a.name.localeCompare(b.name));
            }

            return filtered;
        });

        // Formatear tiempo de juego
        const formatPlaytime = (minutes) => {
            if (!minutes) return '0 horas';
            if (minutes < 60) return `${minutes} minutos`;
            const hours = Math.floor(minutes / 60);
            return `${hours} hora${hours !== 1 ? 's' : ''}`;
        };

        // Mostrar detalles del juego
        const showGameDetails = (game, event) => {
            selectedGame.value = game;
            const rect = event.target.getBoundingClientRect();
            detailsPosition.value = {
                top: `${rect.top + window.scrollY}px`,
                left: `${rect.right + 20}px`
            };
        };

        // Ocultar detalles del juego
        const hideGameDetails = () => {
            selectedGame.value = null;
        };

        // Cargar juegos al iniciar
        loadGames();

        return {
            games,
            searchQuery,
            sortBy,
            selectedGame,
            detailsPosition,
            filteredGames,
            formatPlaytime,
            showGameDetails,
            hideGameDetails
        };
    }
}).mount('#app');

