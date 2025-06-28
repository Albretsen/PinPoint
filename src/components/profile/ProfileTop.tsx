import { useTheme } from '@/src/context/ThemeProvider';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import PinText from '../PinText';

type Stat = {
    value: string,
    label: string,
}

interface ProfileTopProps {
    name: string,
    profileImage: ImageSourcePropType,
    // The image displayed as a cover image at the top of a profile page
    backgroundImage: ImageSourcePropType,
    // The stat at the left of the profile image
    leftStat: Stat,
    // The stat at the right of the profile image
    rightStat: Stat,
    // The user's total xp count
    level: number,
}

export default function ProfileTop(props: ProfileTopProps) {
    const { name, profileImage, backgroundImage, leftStat, rightStat, level } = props;
    const { theme } = useTheme();
    return (
        <View style={styles.container}>
            <Image source={backgroundImage} style={styles.backgroundImage} resizeMode="cover" />
            <View style={styles.profileContainer}>
                <View style={styles.statSection}>
                    <PinText style={[styles.statValueText, { color: theme.colors.text }]}>{leftStat.value}</PinText>
                    <PinText style={[styles.statLabelText, { color: theme.colors.text }]}>{leftStat.label}</PinText>
                </View>
                <View style={styles.profileImageContainer}>
                    <Image source={profileImage} style={[styles.profileImage, { borderColor: theme.colors.border }]} />
                    <PinText style={[styles.nameText, { color: theme.colors.text }]}>{name}</PinText>
                </View>
                <View style={styles.statSection}>
                    <PinText style={[styles.statValueText, { color: theme.colors.text }]}>{rightStat.value}</PinText>
                    <PinText style={[styles.statLabelText, { color: theme.colors.text }]}>{rightStat.label}</PinText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // alignItems: "center",
    },
    backgroundImage: {
        width: '100%',
        height: 150,
        backgroundColor: '#ccc',
    },
    profileContainer: {
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: 'flex-end',
        justifyContent: "space-between",

    },
    profileImageContainer: {
        marginTop: -55, // Overlap the banner
        alignItems: "center",
        gap: 10,
    },
    profileImage: {
        width: 110,
        height: 110,
        borderRadius: 100,
        borderWidth: 4,
        backgroundColor: '#ccc',
    },
    statSection: {
        top: -30,
        gap: 5,
        alignItems: "center",
        flex: 1,
    },
    statValueText: {
        fontSize: 24,
    },
    statLabelText: {
        fontSize: 20,
    },
    nameText: {
        fontSize: 24,
    }
});

