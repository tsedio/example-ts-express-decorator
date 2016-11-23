
import {Service} from "ts-express-decorators";
import UsersService from './UsersService';
import * as Passport from 'passport';
import {Strategy} from "passport-local";

@Service()
export default class PassportLocalService {

    constructor(private usersService: UsersService){

        // used to serialize the user for the session
        Passport.serializeUser(PassportLocalService.serialize);

        // used to deserialize the user
        Passport.deserializeUser(this.deserialize);
    }

    /**
     *
     * @param user
     * @param done
     */
    static serialize(user, done){
        done(null, user._id);
    }

    /**
     *
     * @param id
     * @param done
     */
    public deserialize = (id, done) => {

        done(this.usersService.find(id));

    };

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    public initLocalSignup(){

        Passport
            .use('signup', new Strategy({
                    // by default, local strategy uses username and password, we will override with email
                    usernameField :     'email',
                    passwordField :     'password',
                    passReqToCallback:  true // allows us to pass back the entire request to the callback
                },
                (req, email, password, done) => {
                    console.log('LOCAL SIGNUP', email, password);
                    // asynchronous
                    // User.findOne wont fire unless data is sent back
                    process.nextTick(() => {
                        this.onLocalSignup(req, email, password, done);
                    });
                }))

    }

    private onLocalSignup(req, email, password, done): void {

        const user = this.usersService.findByEmail(email);

        if (user) { //User exists
            return done(null, false);
        }

        // Create new User
        const newUser = this.usersService.create(<any>{
            email: email,
            password: password,
            name: {
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }
        });

        done(null, newUser);

    }

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    public initLocalLogin(){

        Passport.use('login', new Strategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField:     'email',
            passwordField:     'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        }, this.onLocalLogin));

    }

    private onLocalLogin = (req, email, password, done) => {
        //$log.debug('LocalLogin', login, password);

        const user = this.usersService.findByCredential(email, password);

        if (!user) {
            return done(null, false); // req.flash is the way to set flashdata using connect-flash
        }


        // all is well, return successful user
        return done(null, user);

    };
}