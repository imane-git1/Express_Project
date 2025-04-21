import { decodeToken, getUserRole } from '../services/auth_service.js';


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
    const { id } = req.user;

    const getrole = await getUserRole(id);

    if (!getrole.exist) {
      return res.status(404).json({ message: "User not found" });
    }

    if (getrole.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    return next(); 
  }catch (err) {
      return res.status(500).json({ message: "Server error" });
  };
}

export { authMiddleware, isAdmin };