// Local-only OIDC provider. Never deployed with the production application.
import http from 'node:http';
import { randomBytes, createHash } from 'node:crypto';
import { generateKeyPair, exportJWK, SignJWT } from 'jose';
const issuer = 'http://127.0.0.1:4444';
const { privateKey, publicKey } = await generateKeyPair('RS256');
const jwk = { ...await exportJWK(publicKey), kid: 'local-key', use: 'sig', alg: 'RS256' };
const codes = new Map();
const accounts = [{sub:'local-alex',email:'alex@example.test',name:'Alex Morgan'}, {sub:'local-sam',email:'sam@example.test',name:'Sam Keller'}];
http.createServer(async (req,res) => {
 try {
  const url = new URL(req.url, issuer);
  const json = value => {res.setHeader('Content-Type','application/json'); res.end(JSON.stringify(value));};
  if(url.pathname === '/.well-known/openid-configuration') return json({issuer,authorization_endpoint:issuer+'/authorize',token_endpoint:issuer+'/token',jwks_uri:issuer+'/jwks',response_types_supported:['code'],subject_types_supported:['public'],id_token_signing_alg_values_supported:['RS256'],token_endpoint_auth_methods_supported:['client_secret_post','client_secret_basic'],code_challenge_methods_supported:['S256']});
  if(url.pathname === '/jwks') return json({keys:[jwk]});
  if(url.pathname === '/authorize') {
   const redirect = url.searchParams.get('redirect_uri');
   if(redirect !== 'http://127.0.0.1:3333/api/v1/auth/callback' || url.searchParams.get('client_id') !== 'gallery-local' || url.searchParams.get('code_challenge_method') !== 'S256') throw Error('Invalid authorization request');
   const user=accounts.find(a=>a.sub===url.searchParams.get('account'));
   if(!user) { res.setHeader('Content-Type','text/html; charset=utf-8'); return res.end('<!doctype html><html lang="de"><title>Lokale Anmeldung</title><body style="background:#0a0a0a;color:#f5f5f5;font:18px system-ui;padding:60px"><h1>Lokale Testanmeldung</h1><p>Nur synthetische Entwicklungskonten. Produktion verwendet Google.</p>'+accounts.map(a=>{const u=new URL(url);u.searchParams.set('account',a.sub);return '<p><a style="color:#c9a962" href="'+u.pathname+u.search.replaceAll('&','&amp;')+'">'+a.name+'</a></p>';}).join('')+'</body></html>'); }
   const code=randomBytes(32).toString('base64url');
   codes.set(code,{user,challenge:url.searchParams.get('code_challenge'),nonce:url.searchParams.get('nonce'),created:Date.now()});
   const next=new URL(redirect);next.searchParams.set('code',code);next.searchParams.set('state',url.searchParams.get('state')??'');
   res.writeHead(302,{Location:next.href});return res.end();
  }
  if(url.pathname === '/token' && req.method === 'POST'){
   let body='';for await(const b of req){body+=b;if(body.length>8192)throw Error('Too large');}
   const form=new URLSearchParams(body), code=form.get('code'), item=codes.get(code);codes.delete(code);
   const basic='Basic '+Buffer.from('gallery-local:local-secret-not-for-production').toString('base64');
   if(!(req.headers.authorization===basic || form.get('client_secret')==='local-secret-not-for-production'))throw Error('Invalid client');
   if(!item||Date.now()-item.created>60000||createHash('sha256').update(form.get('code_verifier')??'').digest('base64url')!==item.challenge)throw Error('Invalid code');
   const id_token=await new SignJWT({...item.user,email_verified:true,nonce:item.nonce}).setProtectedHeader({alg:'RS256',kid:'local-key'}).setIssuer(issuer).setAudience('gallery-local').setSubject(item.user.sub).setIssuedAt().setExpirationTime('5m').sign(privateKey);
   return json({id_token,access_token:randomBytes(32).toString('base64url'),token_type:'Bearer',expires_in:300});
  }
  res.writeHead(404);res.end();
 } catch {res.writeHead(400,{'Content-Type':'application/json'});res.end('{"error":"invalid_request"}');}
}).listen(4444,'127.0.0.1',()=>console.log('Local OIDC: '+issuer));
