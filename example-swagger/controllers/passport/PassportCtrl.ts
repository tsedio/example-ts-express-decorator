"use strict";

import * as Express from "express";
import * as Passport from "passport";
import {BodyParams, Controller, Post, Req, Required, Res, Status} from "ts-express-decorators";
import {Summary} from "ts-express-decorators/lib/swagger";
import {BadRequest} from "ts-httpexceptions";
import {IUser} from "../../interfaces/User";

@Controller("/passport")
export class PassportCtrl {
    /**
     * Authenticate user with local info (in Database).
     * @param email
     * @param password
     * @param request
     * @param response
     * @param next
     */
    @Post("/login")
    @Summary("Login a user with email and password")
    @Status(200, {description: "Success"})
    async login(@Required() @BodyParams("email") email: string,
                @Required() @BodyParams("password") password: string,
                @Req() request: Express.Request,
                @Res() response: Express.Response) {

        this.validateEmail(email);

        return new Promise<IUser>((resolve, reject) => {
            Passport
                .authenticate("login", (err, user: IUser) => {
                    if (err) {
                        reject(err);
                    }

                    request.logIn(user, (err) => {

                        if (err) {
                            reject(err);
                        } else {
                            resolve(user);
                        }
                    });

                })(request, response, () => {

                });
        });

    }

    /**
     * Try to register new account
     * @param email
     * @param password
     * @param firstName
     * @param lastName
     * @param request
     * @param response
     */
    @Post("/signup")
    @Summary("Create a new account")
    @Status(201, {description: "Created"})
    async signup(@Required() @BodyParams("email") email: string,
                 @Required() @BodyParams("password") password: string,
                 @Required() @BodyParams("firstName") firstName: string,
                 @Required() @BodyParams("lastName") lastName: string,
                 @Req() request: Express.Request,
                 @Res() response: Express.Response) {

        this.validateEmail(email);

        return new Promise((resolve, reject) => {

            Passport.authenticate("signup", (err, user: IUser) => {

                if (err) {
                    return reject(err);
                }

                if (!user) {
                    return reject(!!err);
                }

                request.logIn(user, (err) => {

                    if (err) {
                        return reject(err);
                    }
                    resolve(user);
                });
            })(request, response, () => {

            });
        });
    }

    /**
     * Disconnect user
     * @param request
     */
    @Post("/logout")
    public logout(@Req() request: Express.Request): string {
        request.logout();
        return "Disconnected";
    }

    private validateEmail(email: string) {
        const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!(email && regEmail.test(email))) {
            throw new BadRequest("Email is invalid");
        }
    }
}