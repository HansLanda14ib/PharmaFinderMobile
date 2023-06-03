import {StyleSheet} from "react-native";

export default StyleSheet.create({
    onDutyIcon: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{translateY: -10}],
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },

    pharmacyName: {
        color: 'darkgreen',
        fontSize: 18,
        fontWeight: 'bold',
    },
    pharmacyAddress: {
        color: 'black',
        fontSize: 14,
    },
    pharmacy: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },

    listItemTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 8,
        color: '#000000',
    },
    listItemSubtitle: {
        color: 'gray',
        fontSize: 14,
    },

    container: {
        flex: 1,
    },
    map: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: 120,
        height: 40,
        padding: 5,
        backgroundColor: 'rgba(246,240,240,0.8)',
        borderRadius: 5,
        elevation: 2,
        position: 'absolute',
        top: 410,
        alignSelf: 'center',
        zIndex: 1,
    },
    switch2Container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: 110,
        height: 40,
        padding: 5,
        backgroundColor: 'rgba(246,240,240,0.8)',
        borderRadius: 5,
        elevation: 2,
        position: 'absolute',
        top: 410,
        right: 10,
        alignSelf: 'center',
        zIndex: 1,
    },
    scrollContainer: {
        flex: 1,
        marginTop: '110%',
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingTop: 12,


    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: 100,
        height: 40,
        padding: 5,
        backgroundColor: 'rgba(246,240,240,0.8)',
        borderRadius: 5,
        elevation: 2,
        position: 'absolute',
        top: 410,
        left: 4,
        alignSelf: 'center',
        zIndex: 1,
    },
    modalView: {

        flex: 1, justifyContent: 'center', alignItems: 'center'
    },
    modal4View: {
        marginTop: '132%',
        backgroundColor: '#064d4b',
        paddingHorizontal: 8,

        flex: 1, justifyContent: 'center', alignItems: 'flex-start',
        borderRadius: 10,
        padding: 20,


    },
    modal2View: {
        backgroundColor: '#f1fffa', padding: 20, borderRadius: 10, width: 350, height: 300
    },
    modalClose: {
        alignSelf: 'flex-end'
    },
    callButton: {
        backgroundColor: '#07959a',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 110,
        marginBottom: 40,
        top: 10,
        left:80
    },
    contactButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },
    lastUpdateText: {
        marginVertical: 20,
        fontSize: 16
    },

    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain'
    },
    modalContent: {
        alignItems: 'center'
    },
    pharmacy2Name: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#07959a',
        marginTop:-60
    },
    pharmacy2Address: {
        textAlign: 'center',
        marginBottom: 10,
        color: '#acfffc',
        fontSize: 16,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    closeButtonText: {
        fontSize: 24,
        color: '#ccc',
    },
    pharmacy2DurationDistance: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#acfffc',
        marginBottom:-50
    },

    header: {
        flexDirection: 'column',
        alignItems: 'stretch',
        marginBottom: 60,
    },
    onDutyIconModal: {
        position: 'absolute',
        transform: [{translateY: -5}],
        width: 30,
        height: 30,
        resizeMode: 'center',
    },
    contactButton: {
        backgroundColor: '#07959a',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 50,



    },
});
