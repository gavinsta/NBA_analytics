import React, { useState, ChangeEvent, FormEvent, useEffect } from "react"
import { User } from "../../../server/types/User"
import { Input, Box, Button, useToast, Text, Center, ButtonGroup, Stack } from "@chakra-ui/react";
import { useUserContext } from "../contexts/UserContext";
import { Link, Navigate } from "react-router-dom";
import { useFantasyTeam } from "../contexts/FantasyTeamContext";
const defaultFormFields = {
  email: '',
  password: '',
}

const LoginScreen: React.FC = () => {
  const { login, user } = useUserContext();
  const { loadTeam } = useFantasyTeam();
  // react hooks
  const [formFields, setFormFields] = useState(defaultFormFields)
  const { email, password } = formFields

  const toast = useToast();
  const resetFormFields = () => {
    return (
      setFormFields(defaultFormFields)
    );
  }
  // handle input changes
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormFields({ ...formFields, [name]: value })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const loggedInUser = await login(email, password)
    console.log(loggedInUser)
    if (loggedInUser && loggedInUser.team_id) {
      console.log(loggedInUser.team_id)
      const returnedTeam = await loadTeam(loggedInUser.team_id)
      if (returnedTeam) localStorage.setItem("team", JSON.stringify(returnedTeam))
    }
  }

  const renderRedirect = () => {
    if (user) {
      return <Navigate to="/" />
    }
  }
  return (

    <Center
      height={"80vh"}
      alignContent={"center"}>
      {renderRedirect()}

      <form onSubmit={handleSubmit}>
        <Stack
          spacing={"15px"}>
          <Text>
            Sign In
          </Text>
          <Input
            placeholder="Email"
            type="email"
            required
            name="email"
            value={email}
            onChange={handleChange}
          />
          <Input
            placeholder="Password"
            type='password'
            required
            name='password'
            value={password}
            onChange={handleChange}
          />
          <ButtonGroup>
            <Button type="submit">Sign In</Button>
            <Button type="button" onClick={resetFormFields}>Clear</Button>
            <Link to="/signupPage">
              <Button>
                Sign up
              </Button>
            </Link>
          </ButtonGroup>
        </Stack>
      </form>

    </Center>);
}

export default LoginScreen