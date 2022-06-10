import requests as re
import time
import json as js
import matplotlib.pyplot as plt
import pandas as pd
import geopandas as gpd

while True:
    time_now = time.strftime("%H:%M",time.localtime()) #刷新
    if time_now == "08:00":
        url = 'https://lab.isaaclin.cn/nCoV/api/area?latest=1&country=中国'
        # 调用url，将响应对象存储在变量r中,并转json格式
        r = re.get(url)
        response_dict = r.json()
        #取字典中‘results’目录为dataframe
        china_data = pd.DataFrame(response_dict['results'])
        china_data = china_data.drop(
            axis=1,
            columns=[
                'continentName', 'continentEnglishName', 'countryName',
                'countryEnglishName', 'countryFullName', 'provinceEnglishName',
                'provinceShortName', 'suspectedCount', 'curedCount',
                'deadCount', 'comment', 'updateTime'
            ])
        #去除中国总数据并重建索引
        china_data = china_data.drop(
          china_data[china_data['provinceName'] == '中国'].index).sort_values(by='locationId').reset_index(
             drop=True)


        #读取本地json,更新数据,输出最新CHINA_simplify.geojson、
        #为provinceNew和provinceConfirm里新增当前日期字段
        china_simplify = gpd.read_file('../json/china_simplify.geojson')
        provinceNew = pd.read_json('../json/province_New.json',orient='index')
        provinceConfirm = pd.read_json('../json/province_Confirm.json',orient='index')

        #更新china_simplify
        china_simplify['dailyNewConfirmed'] = [
           int(china_data['confirmedCount'][i] - china_simplify['provinceConfirmed'][i])
          for i in range(len(china_data['confirmedCount']))
        ]
        china_simplify['provinceConfirmed'] = list(china_data['confirmedCount'])
        china_simplify['currentConfirmed'] = list(china_data['currentConfirmedCount'])
        #更新provinceNew
        today = time.strftime("%Y/%m/%d",time.localtime())
        provinceNew[today] = list(china_simplify['dailyNewConfirmed'])
        #更新provinceConfirm
        provinceConfirm[today] = list(china_simplify['provinceConfirmed'])
        

        china_simplify.to_file('../json/china_simplify7.geojson', driver='GeoJSON', encoding='gb18030')
        provinceNew.to_json('../json/province_New2.json',orient='index',force_ascii=False)
        provinceConfirm.to_json('../json/province_Confirm2.json',orient='index',force_ascii=False)


        #用cities中的数据扩充dataframe
        lines = china_data.shape[0]
        for i in range(china_data.shape[0]):
            if len(china_data.loc[i, 'cities']) == 0:
                china_data.loc[i, 'cities'] = china_data.loc[i, 'provinceName']
            else:
                for j in range(1, len(china_data.loc[i, 'cities'])):
                    china_data.loc[lines] = [
                        china_data.loc[i,'locationId'], china_data.loc[i,'provinceName'],
                        china_data.loc[i, 'currentConfirmedCount'],
                        china_data.loc[i,'confirmedCount'], china_data.loc[i,'cities'][j]
                    ]
                    lines += 1
                china_data.loc[i] = [
                    china_data.loc[i, 'locationId'], china_data.loc[i, 'provinceName'],
                    china_data.loc[i, 'currentConfirmedCount'],
                    china_data.loc[i, 'confirmedCount'], china_data.loc[i,'cities'][0]
                ]
        china_data = china_data.sort_values(by='locationId').reset_index(drop=True)
        #新增“市现有确诊人数”列
        currentlist = [
            x['currentConfirmedCount'] for x in china_data['cities']
            if type(x) == dict
        ]
        currentlist.append(int(china_data[china_data['provinceName'] == '台湾']['currentConfirmedCount']))
        currentlist.append(int(china_data[china_data['provinceName'] == '香港']['currentConfirmedCount']))
        currentlist.append(int(china_data[china_data['provinceName'] == '澳门']['currentConfirmedCount']))
        china_data['cityCurrent']=currentlist
        #“市累积确诊人数”
        confirmedlist = [
            x['confirmedCount'] for x in china_data['cities']
            if type(x) == dict
        ]
        confirmedlist.append(int(china_data[china_data['provinceName'] == '台湾']['confirmedCount']))
        confirmedlist.append(int(china_data[china_data['provinceName'] == '香港']['confirmedCount']))
        confirmedlist.append(int(china_data[china_data['provinceName'] == '澳门']['confirmedCount']))
        china_data['cityConfirmed']=confirmedlist
        #“市代号”列
        idlist = [
            x['locationId'] for x in china_data['cities']
            if type(x) == dict
        ]
        idlist.append(int(china_data[china_data['provinceName'] == '台湾']['locationId']))
        idlist.append(int(china_data[china_data['provinceName'] == '香港']['locationId']))
        idlist.append(int(china_data[china_data['provinceName'] == '澳门']['locationId']))
        china_data['cityLocationId']=idlist
        #去掉非市的行，并重建索引
        china_data = china_data.drop(china_data[china_data['cityLocationId'] == 0].index)
        china_data = china_data.drop(
            china_data[china_data['cityLocationId'] == -1].index).sort_values(by='cityLocationId').reset_index(drop=True)

        #API中有数据的市代码
        APICityIdlist = list(china_data['cityLocationId'])
        APIProvinceIDList = list(china_data['locationId'])


        city_simplify = gpd.read_file('../json/city_simplify.geojson').sort_values(by='市代码').reset_index(drop=True)
        
        
        for i in range(city_simplify.shape[0]):
            if list(city_simplify['市代码'])[i] in APICityIdlist:
                index = APICityIdlist.index(list(city_simplify['市代码'])[i])
                city_simplify.loc[i,'cityCurrent']=china_data.loc[index,'cityCurrent']
                city_simplify.loc[i,'cityConfirmed']=china_data.loc[index,'cityConfirmed']
            elif list(city_simplify['市代码'])[i] in APIProvinceIDList:
                index = APIProvinceIDList.index(list(city_simplify['市代码'])[i])
                city_simplify.loc[i,'cityCurrent']=china_data.loc[index,'currentConfirmedCount']
                city_simplify.loc[i,'cityConfirmed']=china_data.loc[index,'confirmedCount']
            else:
                pass


        city_simplify.to_file('../json/city_simplify7.geojson',driver='GeoJSON',encoding='gb18030')



        time.sleep(63)
