import { SpaceList } from "./SpaceList"

type Props = {
  children: React.ReactNode | Promise<React.ReactNode>
}

export const SpaceProvider = ({ children }: Props) => {
  if (true) {
    return <SpaceList />
  }
  
  return <>
  {children}
  </>
}