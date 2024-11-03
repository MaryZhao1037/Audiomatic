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

  return (
    <Card sx={{ maxWidth: 345 }}>
      <Box sx={{ height: 200, backgroundColor: 'black' }}>
        <video width="100%" height="100%" controls>
          <source src="/backend/output/image.png" type="image/" />
          Your browser does not support the video tag.
        </video>
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
  );
}
