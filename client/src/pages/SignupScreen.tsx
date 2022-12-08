import React, { useState, ChangeEvent, FormEvent, useEffect } from "react"
import { User } from "../../../server/types/User"
import { Input, Box, Button, useToast, Text, Center, ButtonGroup, Stack, Alert, AlertIcon, Heading, HStack } from "@chakra-ui/react";
import { useUserContext } from "../contexts/UserContext";
import { Navigate } from "react-router-dom";
const defaultFormFields = {
  name: '',
  email: '',
  password: '',
  confirm_password: ''
}

const SignupScreen: React.FC = () => {
  const { createNewUser, user } = useUserContext();
  // react hooks
  const [formFields, setFormFields] = useState(defaultFormFields)
  const { name, email, password, confirm_password } = formFields
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
    const tempUser: User = {
      name: name,
      email: email,
      password: password,
      room_id: null,
      team_id: null,
    }
    if (formFields.confirm_password !== formFields.password) {
      toast({
        status: "error",
        title: "Passwords must match",
        description: "Try again",
        variant: "subtle",
        position: "top"
      })
    }
    else await createNewUser(tempUser)
  }

  const renderRedirect = () => {
    if (user) {
      return <Navigate to="/" />
    }
  }
  return (
    <Center
      bg={"blackAlpha.800"}
      height={"80vh"}
      alignContent={"center"}>
      {renderRedirect()}


      <form onSubmit={handleSubmit}>
        <Stack
          color={"white"}
          w={"100%"}
        >
          <Heading color={"white"}>
            Sign up and create your dream team
          </Heading>
          <Input

            placeholder="Name"
            type="name"
            required
            name="name"
            value={name}
            onChange={handleChange}
          />
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
          {formFields.confirm_password !== formFields.password ? <Alert
            status='warning'
            variant={"subtle"}
          >
            <AlertIcon />
            Passwords don't match!
          </Alert> : <></>}
          <Input

            placeholder="Confirm Password"
            type='password'
            required
            name='confirm_password'
            value={confirm_password}
            onChange={handleChange}
          />
          <HStack
            justifyContent={"center"}

          >
            <ButtonGroup
              colorScheme={"orange"}>
              <Button type="submit">Sign me up!</Button>
              <Button

                type="button" onClick={resetFormFields}>Clear</Button>
            </ButtonGroup>
          </HStack>

        </Stack>
      </form>
    </Center>);
}

export default SignupScreen