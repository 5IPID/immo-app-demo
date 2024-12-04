
import { Anchor, AppShell,  Box,  Button, Center, Container, Divider, Group, HoverCard, MantineProvider, SimpleGrid, Text, Title } from '@mantine/core';

export function Header() {
    let datas = {
        title: 'Mon Titre',
        buttonProducts: 'Products',
        buttonSignIn: 'Sign in',
        buttonRegister: 'Register'
    }
    return (


        <AppShell.Header>
            <Center>
                <Group>
                    <Group></Group>
                    <Group justify='flex-en d'>
                        <Anchor>abc</Anchor>
                    </Group>
                    <Group justify='flex-end'>

                        <Button variant="default">{datas.buttonProducts}</Button>
                        <Button variant="default">{datas.buttonSignIn}</Button>
                        <Button variant="filled">{datas.buttonRegister}</Button>
                    </Group>
                </Group>

            </Center>
        </AppShell.Header>

    )
}
