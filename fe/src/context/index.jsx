import React, { useContext, createContext } from 'react'

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react'
import { ethers } from 'ethers'
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk'

const StateContext = createContext()

export const StateContextProvider = ({ children }) => {
  // Replace with my own smart contract address
  const { contract } = useContract('0xCF81F1DD2A727C571868B48Ab739dd7EA3003f18')
  const { mutateAsync: createProject } = useContractWrite(contract, 'createProject')
  const { mutateAsync: insertProcess } = useContractWrite(contract, 'insertProcess') // Thêm hàm insertProcess
  const { mutateAsync: insertExpect } = useContractWrite(contract, 'insertExpect')
  const { mutateAsync: insertOutput } = useContractWrite(contract, 'insertOutput')

  const address = useAddress()
  const connect = useMetamask()

  const publishProject = async (title, input) => {
    try {
      const data = await createProject({
        args: [
          address, // owner
          title, // title
          input
        ]
      })

      console.log('contract call success', data)
      return data.receipt
    } catch (error) {
      console.log('contract call failure', error)
    }
  }

  const _insertProcess = async (pId, process) => {
    try {
      const data = await insertProcess({
        args: [pId, process]
      })

      console.log('contract call success', data)
    } catch (error) {
      console.log('contract call failure', error)
    }
  }

  const _insertExpect = async (pId, expect) => {
    try {
      const data = await insertExpect({
        args: [pId, expect]
      })

      console.log('contract call success', data)
    } catch (error) {
      console.log('contract call failure', error)
    }
  }

  const _insertOutput = async (pId, output) => {
    try {
      const data = await insertOutput({
        args: [pId, output]
      })

      console.log('contract call success', data)
    } catch (error) {
      console.log('contract call failure', error)
    }
  }

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createProject: publishProject,
        insertProcess: _insertProcess,
        insertExpect: _insertExpect,
        insertOutput: _insertOutput
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)
