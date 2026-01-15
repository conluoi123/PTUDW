const BASE_URL = 'http://localhost:3000/api/games';

export const GameService = {
    getAllGames: async () => {
        try {
            const response = await fetch(BASE_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch list games');
            }
            const data = await response.json();
            console.log(data);
            return data.data;
        } catch (err) {
            console.log(err);
            return [];
        }
    },
    getGameById: async (game_id) => {
        try {
            const response = await fetch(`${BASE_URL}/${game_id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch game by id');
            }
            const data = await response.json();
            return data.data;
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    createGame: async (game) => {
        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(game),
            });
            if (!response.ok) {
                throw new Error('Failed to create game');
            }
            const data = await response.json();
            return data.data;
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    updateGame: async (game_id, game) => {
        try {
            const response = await fetch(`${BASE_URL}/${game_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(game),
            });
            if (!response.ok) {
                throw new Error('Failed to update game');
            }
            const data = await response.json();
            return data.data;
        } catch (err) {
            console.log(err);
            return null;
        }
    },
    deleteGame: async (game_id) => {
        try {
            const response = await fetch(`${BASE_URL}/${game_id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete game');
            }
            const data = await response.json();
            return data.data;
        } catch (err) {
            console.log(err);
            return null;
        }
    },


}