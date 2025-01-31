import { DrawerContentScrollView } from "@react-navigation/drawer";

export default function CustomDrawerContent( props: any){
    return(
    <DrawerContentScrollView {...props}>
        <DrawerItemList {... props}/>
    </DrawerContentScrollView>
    );
};