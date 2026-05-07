import crypto from 'crypto';

export const hashIP = (ip) => {
  const salt = process.env.IP_SALT || 'default-salt-change-me';
  return crypto.createHash('sha256').update(ip + salt).digest('hex');
};