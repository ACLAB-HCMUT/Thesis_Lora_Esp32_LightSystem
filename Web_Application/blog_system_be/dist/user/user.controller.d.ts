import { SignUpResponse, UserDto } from './dto/user.dto';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    signup(user: UserDto): Promise<SignUpResponse>;
    deleteuser(id: string): Promise<import("./dto/user.dto").DeleteUserResponse>;
    findAll(query: string, take: number, page: number): Promise<{
        statusCode: string;
        data: any[];
        count: any;
        currentPage: any;
        nextPage: any;
        prevPage: number;
        totalPage: number;
    }>;
}
