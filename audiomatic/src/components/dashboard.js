import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
}));

export default function RecipeReviewCard() {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // Sample tags
  const tags = ["Live", "Music", "Album"];

  const imageUrl = "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fG5hdHVyZXxlbnwwfHx8fDE2ODg3MTY2MzI&ixlib=rb-1.2.1&q=80&w=400";
  return (
    <div>
      <div style={{ width: '300px', height: '300px', overflow: 'hidden', border: '1px solid #ccc' }}>
      <img
        src={"https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fG5hdHVyZXxlbnwwfHx8fDE2ODg3MTY2MzI&ixlib=rb-1.2.1&q=80&w=400"}
        alt="Nature"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
    <Card sx={{ maxWidth: 345 }}>
      <Box sx={{ height: 200, backgroundColor: 'black' }}>
        <img
          src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fG5hdHVyZXxlbnwwfHx8fDE2ODg3MTY2MzI&ixlib=rb-1.2.1&q=80&w=400"  // Path to your image file
          alt="Display"
          width="100%"
          height="100%"
          style={{ objectFit: 'cover' }}
        />
      </Box>
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the mussels,
          if you like.
        </Typography>
        {/* Tags Section */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {tags.map((tag, index) => (
            <Chip key={index} label={tag} variant="outlined" />
          ))}
        </Box>
      </CardContent>
    </Card>
    </div>
  );
}
