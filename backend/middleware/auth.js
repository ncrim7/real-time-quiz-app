const jwt = require('jsonwebtoken');

module.exports = (role) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: "Erişim reddedildi!" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Eğer role parametresi varsa, kullanıcı rolüyle eşleşmeli
      if (role && decoded.role !== role) {
        return res.status(403).json({ error: "Bu işlemi yapmaya yetkiniz yok!" });
      }

      next();
    } catch (error) {
      res.status(401).json({ error: "Geçersiz token!" });
    }
  };
};
