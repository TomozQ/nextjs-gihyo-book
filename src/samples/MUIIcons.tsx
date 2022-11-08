import HomeIcon from '@mui/icons-material/Home'

type HomeIconProps = {
  fontSize?: string
  color?: string
}

const HomeIconComponent = ({ fontSize, color }: HomeIconProps) => (
  <span style={{ fontSize, color }}>
    <HomeIcon fontSize="inherit" color="inherit" />
  </span>
)

export const HomeIcons = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <HomeIconComponent />
      <HomeIconComponent fontSize="22px" />
      <HomeIconComponent fontSize="33px" />
      <HomeIconComponent color="red" />
      <HomeIconComponent fontSize="22px" color="#3f51b5" />
    </div>
  )
}
