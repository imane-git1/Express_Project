import { db } from '../config/database.js';
import { decodeToken } from '../services/auth_service.js';


const authMiddleware = async (req, res, next) => {
	try {
		const token = req.headers?.authorization?.split(" ")[1];

		if (!token) {
			return res.status(403).json({
				message: "Token not found",
			});
		}

    try
    {
      const isValidToken = await decodeToken(token);

		  if (isValidToken.isError) {
			  return res.status(401).json({
				  message: "Unauthorized or expired token",
			  });
		  }

      req.user = isValidToken.data;
		  return next();
    }catch(err)
    {
      return res.status(401).json({ message: err.message });
    }
		
	} catch (error) {
		return res.status(401).json({ error });
	}
};

const isAdmin = async (req, res, next) => {
  try {
    const { GET_ROLE_NAME } = authQueries();
    const { id } = req.user;

    // Attente du résultat de la requête SQL
    const [data] = await db.execute(GET_ROLE_NAME(id));

    // Vérification du rôle
    if (data[0].role !== "admin") {
      next(); // L'utilisateur est un admin, on continue l'exécution
    } 

    return next(); // L'utilisateur n'est pas un admin,
  }catch (err) {
      return res.status(500).json({ message: "Server error" });
  };
}

export { authMiddleware, isAdmin };