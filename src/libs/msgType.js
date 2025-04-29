export function setMsg(data, addrGet, timestamp, txhash, all) {
  let finalType = data['@type']
  let finalData = ''
  let titleMsg = ''
  let code = all?.code

  // console.log(all)

  switch (finalType) {
    case '/cosmos.bank.v1beta1.MsgSend':
      console.log(data.to_address, addrGet)
      if (data.to_address === addrGet) {
        titleMsg = 'Receive'
      } else titleMsg = 'Send'
      finalData = {
        from: {
          data: data.from_address,
          name: 'From',
        },
        to: {
          data: data.to_address,
          name: 'To',
        },
        amount: {
          data: data.amount[0],
          name: 'Amount',
        },
      }
      //console.log(finalData)
      break
    case '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission':
      titleMsg = 'Withdraw Validator'
      //console.log(data)
      finalData = data
      finalData = {
        validator_address: {
          data: data.validator_address,
          name: 'Validator address',
        },
      }
      break
    case '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward':
      titleMsg = 'Withdraw Delegator'
      finalData = {
        from: {
          data: data.delegator_address,
          name: 'Delegator',
        },
        to: {
          data: data.validator_address,
          name: 'Reward from',
        },
      }
      //console.log(data)
      break
    case '/cosmos.staking.v1beta1.MsgDelegate':
      titleMsg = 'Delegate'
      console.log(data)
      finalData = {
        from: {
          data: data.delegator_address,
          name: 'From',
        },
        to: {
          data: data.validator_address,
          name: 'To',
        },
        amount: {
          data: data.amount,
          name: 'Amount',
        },
      }
      break
    case '/cosmos.staking.v1beta1.MsgBeginRedelegate':
      titleMsg = 'Redelegate'
      //console.log(finalData)
      break
    case '/cosmos.staking.v1beta1.MsgUndelegate':
      titleMsg = 'Undelegate'
      //console.log(finalData)
      break
    case '/cosmos.staking.v1beta1.MsgUndelegate':
      titleMsg = 'Undelegate'
      //console.log(finalData)
      break
    case '/cosmos.gov.v1beta1.MsgVote':
      titleMsg = 'Voting'
      finalData = {
        proposal_id: {
          data: data.proposal_id,
          name: 'Proposal id',
        },
        option: {
          data: data.option,
          name: 'Vote',
        },
      }
      break
    case '/ibc.applications.transfer.v1.MsgTransfer':
      titleMsg = 'Transfer IBC'
      finalData = {
        sender: {
          data: data.sender,
          name: 'Sender',
        },
        receiver: {
          data: data.receiver,
          name: 'Receiver',
        },
        amount: {
          data: data.token,
          name: 'Amount',
        },
      }
      //console.log(finalData)
      break
    case '/ibc.core.client.v1.MsgUpdateClient':
      titleMsg = 'Update IBC'
      //console.log(finalData)
      break
    case '/cosmos.feegrant.v1beta1.MsgGrantAllowance':
      titleMsg = 'Grant Fee Allowance'
      //console.log(finalData)
      break

    case '/cosmwasm.wasm.v1.MsgExecuteContract':
      titleMsg = 'Execute Contract'
      //console.log(finalData)
      // finalData = data
      finalData = {
        sender: {
          data: data.sender,
          name: 'Sender',
        },
        contract: {
          data: data.contract,
          name: 'Contract',
        },
        msg: {
          data: data.msg,
          name: 'Message',
        },
      }
      break
    case '/cosmos.authz.v1beta1.MsgGrant':
      titleMsg = 'Authz Grant'
      //console.log(finalData)
      break
    case '/cosmos.authz.v1beta1.MsgRevoke':
      titleMsg = 'Authz Revoke'
      //console.log(finalData)
      break

    case '/cosmos.distribution.v1beta1.MsgSetWithdrawAddress':
      titleMsg = 'Set Withdraw Address'
      //console.log(finalData)
      break

    // Group module
    case '/cosmos.group.v1.MsgSubmitProposal':
      titleMsg = 'Submit Group Proposal'
      //console.log(finalData)
      break

    case '/cosmos.group.v1.MsgCreateGroupWithPolicy':
      titleMsg = 'Create Group With Policy'
      //console.log(finalData)
      break

    case '/cosmos.group.v1.MsgExec':
      titleMsg = 'Proposal group Exec'
      //console.log(finalData)
      break

    case '/cosmos.group.v1.MsgCreateGroupPolicy':
      titleMsg = 'Create Group Policy'
      //console.log(finalData)
      break

    case '/cosmos.group.v1.MsgVote':
      titleMsg = 'Group Vote'
      //console.log(finalData)
      break

    case '/cosmos.group.v1.MsgUpdateGroupMembers':
      titleMsg = 'Update Group Members'
      //console.log(finalData)
      break

    case '/cosmos.bank.v1beta1.MsgMultiSend':
      titleMsg = 'MultiSend'
      //console.log(finalData)
      break

    case '/cosmos.staking.v1beta1.MsgTokenizeShares':
      titleMsg = 'Tokenize Shares'
      //console.log(finalData)
      break

    case '/osmosis.poolmanager.v1beta1.MsgSwapExactAmountIn':
      titleMsg = 'Swap Exact Amount In'
      //console.log(finalData)
      break

    case '/osmosis.tokenfactory.v1beta1.MsgBurn':
      titleMsg = 'Tokenfactory burn'
      //console.log(finalData)
      break

    default:
      console.log('Sorry, dont know ' + finalType + '.')
  }
  return { finalType, finalData, titleMsg, timestamp, txhash, code }
}
