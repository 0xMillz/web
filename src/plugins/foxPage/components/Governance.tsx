import {
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Link,
  Progress,
  Skeleton,
  Text as CText,
  useColorModeValue,
} from '@chakra-ui/react'
import { getConfig } from 'config'
import { Amount } from 'components/Amount/Amount'
import { Text } from 'components/Text/Text'
import { bnOrZero } from 'lib/bignumber/bignumber'

import { useGetGovernanceData } from '../hooks/getGovernanceData'

const BOARDROOM_APP_BASE_URL = getConfig().REACT_APP_BOARDROOM_APP_BASE_URL
const SNAPSHOT_BASE_URL = getConfig().REACT_APP_SNAPSHOT_BASE_URL

export const Governance = () => {
  const linkColor = useColorModeValue('blue.500', 'blue.200')
  const governanceData = useGetGovernanceData()

  return (
    <Card display='block' width='full'>
      <CardHeader>
        <Flex flexDirection='row' justifyContent='space-between' alignItems='center' mb={2}>
          <Text translation='plugins.foxPage.governanceTitle' fontWeight='bold' color='inherit' />
          <Link isExternal href={SNAPSHOT_BASE_URL} fontWeight='semibold' color={linkColor}>
            <Text translation='plugins.foxPage.seeAllProposals' />
          </Link>
        </Flex>
        <Text translation='plugins.foxPage.governanceDescription' color='text.subtle' />
      </CardHeader>
      <Skeleton
        isLoaded={governanceData.loaded}
        minHeight={governanceData.loaded ? 'auto' : '176px'}
      >
        {governanceData?.data.map((proposal, i) => (
          <CardBody key={i}>
            <Box>
              <Link
                isExternal
                href={`${BOARDROOM_APP_BASE_URL}proposal/${proposal.refId}`}
                fontWeight='semibold'
                color={linkColor}
                mb={4}
                display='inline-block'
              >
                <CText>{proposal.title}</CText>
              </Link>
              {proposal.choices.map((choice, i) => (
                <Box mb={4} key={i}>
                  <Flex justifyContent='space-between' mb={2}>
                    <CText fontWeight='semibold'>{choice}</CText>

                    <Flex>
                      <Amount
                        value={proposal.results[i].absolute}
                        maximumFractionDigits={2}
                        fontWeight='semibold'
                        mr={2}
                      />
                      <Badge
                        colorScheme='blue'
                        display='flex'
                        alignItems='center'
                        px={2}
                        py={'2px'}
                        borderRadius='md'
                      >
                        <Amount.Percent value={proposal.results[i].percent} fontWeight='normal' />
                      </Badge>
                    </Flex>
                  </Flex>
                  <Progress
                    value={bnOrZero(proposal.results[i].percent).times(100).toNumber()}
                    height={1}
                    colorScheme='green'
                  />
                </Box>
              ))}
            </Box>
          </CardBody>
        ))}
      </Skeleton>
    </Card>
  )
}
