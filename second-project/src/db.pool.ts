import { Controller } from '@nestjs/common';
import { pool } from 'src/db.pool';

@Controller('user')
export class UserController {

    @Get()
    getuser()=>{
        const getdata=pool.query("select * from users")
        return getdata;
    }
}
