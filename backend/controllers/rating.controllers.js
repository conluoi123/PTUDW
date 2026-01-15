const getAllRatings = async (req,res) => {
    try {
        const { gameId } = req.params;
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: "Internal server error"})
    }
}