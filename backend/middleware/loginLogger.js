import geoip from 'geoip-lite';

const loginLogger = (req, res, next) => {
  if (req.path === '/api/auth/login' && req.method === 'POST') {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const time = new Date();
    const geo = geoip.lookup(ip) || {};
    req.loginLog = {
      ip,
      userAgent,
      time,
      location: geo.city ? `${geo.city}, ${geo.country}` : null
    };
  }
  next();
};

export default loginLogger;
