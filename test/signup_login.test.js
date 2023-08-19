var assert = require('assert');

/*
    Tests Signup and Login Pathways
*/

let email = "testing_email@gmail.com"
let name = "testing_name"
let password = "password"
let username = "testing_username"

describe('Test Basic Signup Pathway', async function() {
    it("sign up -> login -> get-logged-in", async function() {

        //test signup
        let res = await fetch('http://localhost:3000/api/authentication/sign-up', {
            method: "POST",
            body: JSON.stringify({
                email: email,
                name: name,
                password: password,
                username: username,
            })
        })

        assert.equal(res.ok, true, "singup call should return status 200")

        res = await fetch('http://localhost:3000/api/testing/getUserByUsername', {
            method: "POST",
            body: JSON.stringify({
                username: username
            })
        })
        
        assert.equal(res.ok, true, 'user was not created on signup')

        let user = (await res.json()).user

        assert.equal(user.email, email, 'email does not match')
        assert.equal(user.name, name, 'name does not match')
        assert.equal(user.username, username, 'username does not match')


        //test login
        res = await fetch('http://localhost:3000/api/authentication/login', {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password,
            })
        })
        let token = (await res.json()).token
        assert.notEqual(token, undefined)

        //test getloggedIn
        res = await fetch('http://localhost:3000/api/authentication/get-logged-in', {
            method: "GET",
            headers: { token: token }
        })
        user = (await res.json()).user
        assert.notEqual(user, undefined)

        assert.equal(user.email, email, 'email does not match')
        assert.equal(user.name, name, 'name does not match')
        assert.equal(user.username, username, 'username does not match')
    })

    after(async function() {
        //just to make sure this data doesn't linger in the db in case of a failed test
        await fetch('http://localhost:3000/api/testing/deleteUserByUsername', {
            method: "POST",
            body: JSON.stringify({
                username: username
            })
        })
    })
})