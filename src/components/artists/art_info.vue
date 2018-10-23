<template>
    <v-container class="container">
        <v-layout row>
            <v-flex xs12>
                <h2 class="headline">
                    Art Info
                </h2>
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs12>
                <from>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-filed 
                            name='artistName'
                            label= 'Artist Name'
                            >
                            </v-text-filed>
                        </v-flex>
                    </v-layout>
                </from>
            </v-flex>

        </v-layout>
    </v-container>
</template>
<style>
.container{
  height:100vh;
}
</style>