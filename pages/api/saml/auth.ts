import { createHash } from 'crypto';
import config from 'lib/env';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { User } from 'types';
import { createResponseForm, createResponseXML, signResponseXML } from 'utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const email = req.body.email;

    if (!email.endsWith('@example.com')) {
      res.status(403).send(`${email} denied access`);
    }
    const id = createHash('sha256').update(email).digest('hex');

    const user: User = {
      id,
      email,
      firstName: id,
      lastName: id,
    };

    const xml = await createResponseXML({
      idpIdentityId: config.entityId,
      audience: req.body.audience,
      acsUrl: req.body.acsUrl,
      samlReqId: req.body.id,
      user: user,
    });

    const xmlSigned = await signResponseXML(xml, config.privateKey, config.publicKey);
    const encodedSamlResponse = Buffer.from(xmlSigned).toString('base64');
    const html = createResponseForm(req.body.relayState, encodedSamlResponse, req.body.acsUrl);

    res.send(html);
  } else {
    res.status(405).send(`Method ${req.method} Not Allowed`);
  }
}
