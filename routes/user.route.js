import express from 'express';
import { db } from '../db/index.js';
import { usersTable } from '../models/index.js';
import { eq } from 'drizzle-orm';
import { randomBytes, createHmac } from 'crypto';
import { signupPostRequestSchema } from '../validation/request.validation.js';
import { hashPasswordWithSalt } from '../utils/hash.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const validationResult = await signupPostRequestSchema.safeParseAsync(req.body);

    if (validationResult.error)
    {
        return res.status(400).json({ error: validationResult.error.message});
    }

    const { firstname, lastname, email, password } = validationResult.data;

    const [existingUser] = await db
        .select({
            id: usersTable.id,
        })
        .from(usersTable)
        .where(eq(usersTable.email, email));

    if (existingUser)
        return res
            .status(400)
            .json({ message: `User with this email ${email} already exists` });
    
    const { salt, password: hashedPassword } = hashPasswordWithSalt(password);

    const user = await db.insert(usersTable).values({
        email,
        firstname,
        lastname,
        salt,
        password: hashedPassword,
    }).returning({ id: usersTable.id });

    return res.status(201).json({ data: { userId: user.id } });
});

export default router;
