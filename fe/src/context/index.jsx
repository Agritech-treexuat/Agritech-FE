import React, { useContext, createContext } from 'react'

import { useAddress, useContract, useContractWrite, useConnect } from '@thirdweb-dev/react'

const StateContext = createContext()

export const StateContextProvider = ({ children }) => {
  // Replace with my own smart contract address
  const qr_contract_address = process.env.REACT_APP_QR_CONTRACT_ADDRESS
  const camera_contract_address = process.env.REACT_APP_CAMERA_CONTRACT_ADDRESS
  const contract_address = process.env.REACT_APP_PROJECT_CONTRACT_ADDRESS
  const { contract: qr_contract } = useContract(qr_contract_address)
  const { contract: camera_contract } = useContract(camera_contract_address)
  const { contract } = useContract(contract_address)

  const { mutateAsync: addProject } = useContractWrite(contract, 'createProject')
  const { mutateAsync: insertProcess } = useContractWrite(contract, 'insertProcess') // Thêm hàm insertProcess
  const { mutateAsync: insertExpect } = useContractWrite(contract, 'insertExpect')
  const { mutateAsync: insertOutput } = useContractWrite(contract, 'insertOutput')
  const { mutateAsync: insertImage } = useContractWrite(contract, 'insertImage')
  const { mutateAsync: insertWeather } = useContractWrite(contract, 'insertWeather')
  const { mutateAsync: updateInput } = useContractWrite(contract, 'updateInput')
  const { mutateAsync: updateProcess } = useContractWrite(contract, 'updateProcess')
  const { mutateAsync: updateExpect } = useContractWrite(contract, 'updateExpect')
  const { mutateAsync: updateOutput } = useContractWrite(contract, 'updateOutput')

  const { mutateAsync: generateQR } = useContractWrite(qr_contract, 'generateQR')

  const { mutateAsync: addCamera } = useContractWrite(camera_contract, 'addCamera')

  const address = useAddress()
  const connect = useConnect()

  const publishProject = async ({ farm, input }) => {
    try {
      const data = await addProject({
        args: [address, farm, input]
      })

      console.log('contract call success', data)
      return data.receipt
    } catch (error) {
      console.log('contract call failure', error)
    }
  }

  const _insertProcess = async ({ pId, process }) => {
    try {
      const data = await insertProcess({
        args: [pId, process]
      })

      console.log('contract call success', data)
      return data.receipt
    } catch (error) {
      console.log('contract call failure', error)
    }
  }

  const _insertExpect = async ({ pId, expect }) => {
    try {
      const data = await insertExpect({
        args: [pId, expect]
      })

      console.log('contract call success', data)
      return data.receipt
    } catch (error) {
      console.log('contract call failure', error)
    }
  }

  const _insertOutput = async ({ pId, output }) => {
    try {
      const data = await insertOutput({
        args: [pId, output]
      })

      console.log('contract call success', data)
      return data.receipt
    } catch (error) {
      console.log('contract call failure', error)
    }
  }

  const _insertImage = async ({ pId, image }) => {
    try {
      const data = await insertImage({
        args: [pId, image]
      })

      console.log('contract call success', data)
      return data.receipt
    } catch (error) {
      console.log('contract call failure', error)
    }
  }

  const _insertWeather = async ({ pId, weather }) => {
    try {
      const data = await insertWeather({
        args: [pId, weather]
      })

      console.log('contract call success', data)
      return data.receipt
    } catch (error) {
      console.log('contract call failure', error)
    }
  }

  const _updateInput = async ({ pId, input }) => {
    try {
      const data = await updateInput({
        args: [pId, input]
      })

      console.log('contract call success', data)
      return data.receipt
    } catch (error) {
      console.log('contract call failure', error)
    }
  }

  const _updateProcess = async ({ pId, process }) => {
    try {
      const data = await updateProcess({
        args: [pId, process]
      })

      console.log('contract call success', data)
      return data.receipt
    } catch (error) {
      console.log('contract call failure', error)
    }
  }

  const _updateExpect = async ({ pId, expect }) => {
    try {
      const data = await updateExpect({
        args: [pId, expect]
      })

      console.log('contract call success', data)
      return data.receipt
    } catch (error) {
      console.log('contract call failure', error)
    }
  }

  const _updateOutput = async ({ pId, output }) => {
    try {
      const data = await updateOutput({
        args: [pId, output]
      })

      console.log('contract call success', data)
      return data.receipt
    } catch (error) {
      console.log('contract call failure', error)
    }
  }

  const _generateQR = async ({ projectId, numberOfQR, privateIds, generateQRInfo }) => {
    try {
      const data = await generateQR({
        args: [projectId, numberOfQR, privateIds, generateQRInfo]
      })

      console.log('contract call success', data)
      return data.receipt
    } catch (error) {
      console.log('contract call failure', error)
    }
  }

  const _addCamera = async () => {
    try {
      const data = await addCamera({
        args: []
      })

      console.log('contract call success', data)
      return data.receipt
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
        insertOutput: _insertOutput,
        insertImage: _insertImage,
        insertWeather: _insertWeather,
        updateInput: _updateInput,
        updateProcess: _updateProcess,
        updateExpect: _updateExpect,
        updateOutput: _updateOutput,
        generateQR: _generateQR,
        addCamera: _addCamera
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)
